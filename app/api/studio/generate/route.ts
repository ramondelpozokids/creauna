import { NextResponse } from 'next/server';
import { generateStudioChange, type StudioGenerateInput } from '../../../lib/ai/studioEngine';
import type { PremiumStarterContent } from '../../../lib/studio/premiumContentTypes';
import { shouldGenerateFullSite } from '../../../lib/ai/intentAnalyzer';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';
import { sanitizeClientFacingMessage } from '../../../lib/ai/clientFacingCopy';
import { getSessionUser } from '../../../lib/auth/session';
import { consumeCredit, refundCredit, resolveCredits } from '../../../lib/credits';
import { createProjectSnapshot } from '../../../lib/studio/snapshotService';
import { studioFeatureEnabled, type StudioChatMessage } from '../../../lib/studio/contextTypes';
import { hydrateStudioContext } from '../../../lib/studio/contextManager';
import { validatePreviewSections } from '../../../lib/studio/sectionValidator';
import { summarizeSectionDiff, hasMeaningfulSectionChanges } from '../../../lib/studio/sectionDiff';
import { logProjectChangeAudit } from '../../../lib/studio/auditService';
import { updateProject } from '../../../lib/projects';
import { canUseServerSections } from '../../../lib/studio/sectionSelector';
import type { StudioDiscoveryAnswers } from '../../../lib/studio/discoveryTypes';

export const maxDuration = 300;

function isDbUnavailable(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('DATABASE_URL') ||
    msg.includes('PrismaClientInitializationError') ||
    msg.includes("Can't reach database")
  );
}

function parseDiscovery(raw: unknown): StudioDiscoveryAnswers | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const d = raw as Record<string, unknown>;
  if (typeof d.sectorId !== 'string' || typeof d.templateSlug !== 'string') return undefined;
  if (typeof d.businessName !== 'string' || d.businessName.trim().length < 2) return undefined;
  if (!d.features || typeof d.features !== 'object') return undefined;
  const style = d.style === 'minimal' || d.style === 'moderno' ? d.style : 'elegante';
  const palette =
    d.palette === 'slate' ||
    d.palette === 'amber' ||
    d.palette === 'emerald' ||
    d.palette === 'rose' ||
    d.palette === 'dark'
      ? d.palette
      : 'indigo';
  const heroStyle =
    d.heroStyle === 'full' || d.heroStyle === 'split' || d.heroStyle === 'minimal'
      ? d.heroStyle
      : 'cinematic';
  const navPages = Array.isArray(d.navPages)
    ? d.navPages.filter((p): p is string => typeof p === 'string').slice(0, 20)
    : ['inicio', 'contacto'];
  return {
    sectorId: d.sectorId.slice(0, 64),
    templateSlug: d.templateSlug.slice(0, 64),
    businessName: d.businessName.slice(0, 120),
    tagline: typeof d.tagline === 'string' ? d.tagline.slice(0, 200) : undefined,
    style,
    palette,
    heroStyle,
    features: d.features as StudioDiscoveryAnswers['features'],
    navPages,
    extraNotes: typeof d.extraNotes === 'string' ? d.extraNotes.slice(0, 500) : undefined,
  };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`studio:${ip}`, 40, 60_000);
  if (limited) return limited;

  const session = await getSessionUser();
  const started = Date.now();

  try {
    const creditStatus = await resolveCredits(session?.id ?? null, ip, session?.email);
    const unlimited = creditStatus.unlimited === true;

    if (!unlimited && creditStatus.credits <= 0) {
      return NextResponse.json(
        { error: 'Sin créditos. Regístrate o mejora tu plan en /precios', credits: 0 },
        { status: 402 }
      );
    }

    const body = await req.json();
    const prompt = sanitizeText(body.prompt, 15000);
    const lang = body.lang === 'en' ? 'en' : 'es';
    const action = body.action || 'change';
    const style = body.style;
    const sectionId = typeof body.sectionId === 'number' ? body.sectionId : undefined;
    const projectId = typeof body.projectId === 'string' ? body.projectId : undefined;
    const changeLog = Array.isArray(body.changeLog) ? body.changeLog : [];
    const useServerSections = body.useServerSections === true;
    let previewSections = Array.isArray(body.previewSections) ? body.previewSections : [];
    const messages: StudioChatMessage[] = Array.isArray(body.messages)
      ? body.messages
          .filter((m: { role?: string; content?: string }) => m?.content && (m.role === 'user' || m.role === 'ai'))
          .map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? ('user' as const) : ('ai' as const),
            content: String(m.content).slice(0, 2000),
          }))
      : [];

    if (!prompt && action === 'change') {
      return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 });
    }

    if (canUseServerSections(projectId, previewSections) && useServerSections) {
      previewSections = [];
    }

    const context = await hydrateStudioContext({
      userId: session?.id,
      projectId,
      clientSections: previewSections,
      action,
      sectionId,
      messages,
      lang,
    });

    previewSections = context.previewSections;
    if (previewSections.length === 0 && !shouldGenerateFullSite(prompt, action, previewSections)) {
      return NextResponse.json({ error: 'No hay secciones para editar' }, { status: 400 });
    }

    const effectiveSectionId = sectionId ?? context.focusSectionId;

    let snapshotId: string | undefined;
    if (
      studioFeatureEnabled('snapshots') &&
      session &&
      projectId &&
      previewSections.length > 0
    ) {
      try {
        const snap = await createProjectSnapshot(session.id, projectId, {
          sections: previewSections,
          changeLog,
          action,
          prompt: prompt || undefined,
          sectionId: effectiveSectionId,
          label: prompt ? prompt.slice(0, 80) : action,
        });
        snapshotId = snap?.id;
      } catch (snapErr) {
        console.error('studio snapshot (non-fatal):', snapErr);
      }
    }

    const spent = unlimited
      ? { ok: true as const, credits: creditStatus.credits }
      : await consumeCredit(session?.id ?? null, ip, 'studio_generate', session?.email);
    if (!spent.ok) {
      return NextResponse.json({ error: 'Sin créditos disponibles', credits: spent.credits }, { status: 402 });
    }

    const sectorId = typeof body.sectorId === 'string' ? body.sectorId.slice(0, 64) : undefined;
    const templateSlug =
      typeof body.templateSlug === 'string'
        ? body.templateSlug.slice(0, 64)
        : context.templateSlug ?? undefined;
    const businessName =
      typeof body.businessName === 'string'
        ? body.businessName.slice(0, 120)
        : context.projectName;
    const discovery = parseDiscovery(body.discovery);
    const premiumStarterSlug =
      typeof body.premiumStarterSlug === 'string'
        ? body.premiumStarterSlug.slice(0, 64)
        : undefined;
    const premiumPersonalization =
      body.premiumPersonalization && typeof body.premiumPersonalization === 'object'
        ? (body.premiumPersonalization as StudioGenerateInput['premiumPersonalization'])
        : undefined;
    const premiumContent =
      body.premiumContent && typeof body.premiumContent === 'object'
        ? (body.premiumContent as PremiumStarterContent)
        : undefined;

    const result = await generateStudioChange({
      prompt: prompt || 'regenerar',
      lang,
      previewSections,
      action,
      style,
      sectionId: effectiveSectionId,
      sectorId: discovery?.sectorId ?? sectorId,
      templateSlug: discovery?.templateSlug ?? templateSlug,
      premiumStarterSlug,
      premiumPersonalization,
      premiumContent,
      businessName: discovery?.businessName ?? businessName,
      discovery,
      recentMessages: context.recentMessages,
      sectionOutline: context.sectionOutline,
    });

    let validationOk = true;
    let validationErrors: string[] = [];

    if (studioFeatureEnabled('validation')) {
      const validation = validatePreviewSections(result.previewSections, result.changedSectionIds);
      validationOk = validation.ok;
      validationErrors = validation.errors;
    }

    const diffSummary = summarizeSectionDiff(
      previewSections,
      result.previewSections,
      result.changedSectionIds
    );

    const meaningful = hasMeaningfulSectionChanges(
      previewSections,
      result.previewSections,
      result.changedSectionIds
    );

    if (!meaningful && action !== 'initial') {
      await refundCredit(session?.id ?? null, ip, 'studio_refund_no_change', session?.email);
      await logProjectChangeAudit({
        projectId,
        userId: session?.id,
        ip,
        action,
        prompt,
        sectionId: effectiveSectionId,
        affectedSectionIds: result.changedSectionIds,
        source: result.source,
        motorsUsed: result.motorsUsed,
        validationOk: false,
        validationErrors: ['no_meaningful_diff'],
        diffSummary,
        durationMs: Date.now() - started,
        snapshotId,
      });
      return NextResponse.json(
        {
          error:
            lang === 'es'
              ? 'No hubo cambio visible. No se ha consumido crédito. Prueba otra sugerencia o describe el cambio con más detalle.'
              : 'No visible change. No credit was used. Try another suggestion or describe the change in more detail.',
          credits: spent.credits + (unlimited ? 0 : 1),
          snapshotId,
        },
        { status: 422 }
      );
    }

    if (!validationOk) {
      await refundCredit(session?.id ?? null, ip, 'studio_refund_validation', session?.email);
      await logProjectChangeAudit({
        projectId,
        userId: session?.id,
        ip,
        action,
        prompt,
        sectionId: effectiveSectionId,
        affectedSectionIds: result.changedSectionIds,
        source: result.source,
        motorsUsed: result.motorsUsed,
        validationOk: false,
        validationErrors,
        diffSummary,
        durationMs: Date.now() - started,
        snapshotId,
      });
      return NextResponse.json(
        {
          error: lang === 'es' ? 'Validación fallida: cambio no aplicado' : 'Validation failed: change not applied',
          validationErrors,
          snapshotId,
          credits: spent.credits + (unlimited ? 0 : 1),
        },
        { status: 422 }
      );
    }

    await logProjectChangeAudit({
      projectId,
      userId: session?.id,
      ip,
      action,
      prompt,
      sectionId: effectiveSectionId,
      affectedSectionIds: result.changedSectionIds,
      source: result.source,
      motorsUsed: result.motorsUsed,
      validationOk: true,
      validationErrors: [],
      diffSummary,
      durationMs: Date.now() - started,
      snapshotId,
    });

    if (session?.id && projectId && result.previewSections.length > 0) {
      try {
        await updateProject(session.id, projectId, { sections: result.previewSections });
      } catch (persistErr) {
        console.error('studio persist (non-fatal):', persistErr);
      }
    }

    return NextResponse.json({
      message: sanitizeClientFacingMessage(result.message),
      previewSections: result.previewSections,
      changedSectionIds: result.changedSectionIds,
      source: result.source,
      templateSlug: result.templateSlug,
      businessName: result.businessName,
      sectorId: result.sectorId,
      sectorLabel: result.sectorLabel,
      credits: spent.credits,
      unlimited,
      snapshotId,
      diffSummary,
      // Interno solo en logs/audit — no exponer stack al cliente
    });
  } catch (error) {
    console.error('api/studio/generate:', error);
    if (isDbUnavailable(error)) {
      return NextResponse.json(
        {
          error:
            'Base de datos no disponible. Configura DATABASE_URL y ejecuta prisma db push en Vercel/local.',
        },
        { status: 503 }
      );
    }
    const credits = await refundCredit(session?.id ?? null, ip, 'studio_refund_error', session?.email);
    return NextResponse.json({ error: 'Error al generar el diseño', credits }, { status: 500 });
  }
}
