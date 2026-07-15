'use client';

import { Suspense, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, Sparkles, RefreshCw, Download, Share2,
  Monitor, Smartphone, Zap, Coins, Rocket, History, Eye, Image, UtensilsCrossed, Star, CalendarDays, Info, Trophy, ScanLine,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StudioCheckoutModal from '../components/StudioCheckoutModal';
import StudioOnboarding from '../components/StudioOnboarding';
import StudioDiscoveryWizard from '../components/StudioDiscoveryWizard';
import StudioPremiumStarterForm from '../components/StudioPremiumStarterForm';
import StudioPremiumContentEditor, { type PremiumEditorTab } from '../components/StudioPremiumContentEditor';
import StudioSectionPreview from '../components/StudioSectionPreview';
import StudioGenerationProgress from '../components/StudioGenerationProgress';
import type { StudioDiscoveryAnswers } from '../lib/studio/discoveryTypes';
import type { PremiumStarterPersonalization } from '../data/premiumStarters';
import { getPremiumStarterBySlug } from '../data/premiumStarters';
import { buildPremiumStarterHtml, loadPremiumStarter } from '../lib/studio/loadPremiumStarter';
import { normalizePremiumContent, type PremiumStarterContent } from '../lib/studio/premiumContentTypes';
import { useLanguage } from '../components/LanguageProvider';
import { getCredits, setCredits as setCreditsCache, syncCreditsFromServer, FREE_CREDITS } from '../lib/studioCredits';
import { getTemplateBySlug } from '../data/templates';
import { loadCatalogTemplate } from '../lib/studio/loadCatalogTemplate';

type Language = 'es' | 'en';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

interface PreviewSection {
  id: number;
  type: string;
  html: string;
}

interface ChangeEntry {
  id: number;
  summary: string;
  time: string;
}

interface SnapshotRow {
  id: string;
  versionNumber: number;
  label: string | null;
  action: string;
  createdAt: string;
}

interface StudioImpact {
  scope: 'single' | 'multi' | 'full';
  risk: 'low' | 'medium' | 'high';
  reasonEs: string;
  reasonEn: string;
}

const translations = {
  es: {
    title: 'CREAUNA Studio',
    subtitle: 'Diseño con IA',
    welcome: 'Hola. Soy tu director de diseño. Los 4 motores de IA trabajan en equipo para crear tu web. ¿Qué quieres diseñar hoy?',
    welcomeOnboarding: 'Bienvenido al Studio. Describe en lenguaje natural qué web quieres — la IA la genera contigo.',
    welcomeDiscovery: 'Te guiaré paso a paso: sector, secciones, colores, menú y más. Al final genero tu web profesional completa.',
    welcomeDescribe: 'Cuéntame tu negocio en texto libre y crearé tu primera versión.',
    welcomePremium: (name: string) =>
      `Muestra premium «${name}» cargada. Edita carta, destacados, menús del día o galería desde la barra superior.`,
    welcomeTemplate: (name: string) =>
      `Plantilla «${name}» cargada. Navega la vista en tiempo real a la derecha y dime qué quieres mejorar.`,
    placeholder: 'Describe lo que quieres cambiar...',
    placeholderDescribe: 'Ej: gestoría con contacto, mapa, sidebar y footer legal…',
    regenerate: 'Regenerar',
    share: 'Compartir',
    export: 'Exportar',
    finalize: 'Finalizar y pagar',
    quickPrompts: [
      'Hazla más elegante y refinada',
      'Añade testimonios bonitos',
      'Usa tipografía más sofisticada',
      'Versión más clara y luminosa',
      'Añade animaciones sutiles',
      'Haz el hero más impactante',
    ],
    livePreview: 'VISTA EN TIEMPO REAL',
    draft: 'BORRADOR',
    ready: 'LISTO PARA PUBLICAR',
    improve: 'Mejorar',
    thinking: 'Los motores IA refinan tu diseño…',
    successUpdate: 'Diseño actualizado',
    noCredits: 'Sin créditos. Mejora tu plan en /precios',
    creditUsed: '1 crédito (~0,13€ en Pro anual)',
    creditHint: '1 cambio = 1 crédito · Gratis: 0€ · Pro: ~0,13€/cambio (anual)',
    paymentRequired: 'Completa el pago para exportar o publicar',
    creditsLeft: 'créditos',
    unlimitedAccess: 'Acceso ilimitado',
    changes: 'Historial de cambios',
    noChanges: 'Los cambios aparecerán aquí al editar',
    viewCollection: 'Ver colección',
    viewDemo: 'Ver demo',
    templateLoaded: 'Plantilla activa',
    instant: 'CADA CAMBIO ES INSTANTÁNEO',
    selectSection: 'Selecciona una sección para editarla',
    sections: { hero: 'Inicio', menu: 'Menú', services: 'Servicios', about: 'Sobre nosotros', gallery: 'Galería', reviews: 'Reseñas', location: 'Ubicación', blog: 'Blog', reservation: 'Reservas', contact: 'Contacto', footer: 'Legal', widgets: 'Accesos', testimonial: 'Testimonios', fullpage: 'Web completa' },
    changeApplied: 'Cambio visible aplicado',
    snapshots: 'Restaurar versión',
    restore: 'Restaurar',
    restored: 'Versión restaurada',
    confirmContinue: '¿Continuar? (1 crédito)',
  },
  en: {
    title: 'CREAUNA Studio',
    subtitle: 'AI Design',
    welcome: 'Hello. Your design director here. 4 AI engines work as a team to build your site. What shall we design today?',
    welcomeOnboarding: 'Welcome to the Studio. Describe in natural language what site you want — AI builds it with you.',
    welcomeDiscovery: 'I will guide you step by step: sector, sections, colors, menu and more. Then I generate your full professional site.',
    welcomeDescribe: 'Tell me about your business in free text and I will create your first version.',
    welcomePremium: (name: string) =>
      `Premium sample «${name}» loaded. Edit menu, highlights, daily menus or gallery from the top bar.`,
    welcomeTemplate: (name: string) =>
      `Template «${name}» loaded. Check the live preview on the right and tell me what to improve.`,
    placeholder: 'Describe what you want to change...',
    placeholderDescribe: 'E.g. law firm with contact, map, sidebar and legal footer…',
    regenerate: 'Regenerate',
    share: 'Share',
    export: 'Export',
    finalize: 'Finalize & pay',
    quickPrompts: [
      'Make it more elegant and refined',
      'Add beautiful testimonials',
      'Use more sophisticated typography',
      'Brighter and lighter version',
      'Add subtle animations',
      'Make the hero more impactful',
    ],
    livePreview: 'LIVE PREVIEW',
    draft: 'DRAFT',
    ready: 'READY TO PUBLISH',
    improve: 'Improve',
    thinking: 'AI engines refining your design…',
    successUpdate: 'Design updated',
    noCredits: 'No credits left. Upgrade at /precios',
    creditUsed: '1 credit (~€0.13 on Pro annual)',
    creditHint: '1 change = 1 credit · Free: €0 · Pro: ~€0.13/change (annual)',
    paymentRequired: 'Complete payment to export or publish',
    creditsLeft: 'credits',
    unlimitedAccess: 'Unlimited access',
    changes: 'Change history',
    noChanges: 'Changes will appear here as you edit',
    viewCollection: 'View collection',
    viewDemo: 'View demo',
    templateLoaded: 'Active template',
    instant: 'EVERY CHANGE IS INSTANT',
    selectSection: 'Select a section to edit it',
    sections: { hero: 'Home', menu: 'Menu', services: 'Services', about: 'About us', gallery: 'Gallery', reviews: 'Reviews', location: 'Location', blog: 'Blog', reservation: 'Booking', contact: 'Contact', footer: 'Legal', widgets: 'Shortcuts', testimonial: 'Testimonials', fullpage: 'Full site' },
    changeApplied: 'Visible change applied',
    snapshots: 'Restore version',
    restore: 'Restore',
    restored: 'Version restored',
    confirmContinue: 'Continue? (1 credit)',
  },
};

function buildDescribePlaceholder(lang: Language) {
  return `<div class="border-2 border-dashed border-slate-200 rounded-[3rem] px-12 py-24 text-center text-slate-400">
  <p class="text-lg font-medium">${lang === 'es' ? 'Tu web aparecerá aquí' : 'Your site will appear here'}</p>
  <p class="mt-2 text-sm">${lang === 'es' ? 'Describe tu proyecto en el panel de arriba ↑' : 'Describe your project in the panel above ↑'}</p>
</div>`;
}

function buildDefaultHero(lang: Language, templateSlug?: string) {
  const collection = lang === 'es' ? 'Ver colección' : 'View collection';
  const demo = lang === 'es' ? 'Ver demo' : 'View demo';
  const demoHref = templateSlug ? `/templates/preview/${templateSlug}` : '/templates';
  return `<div class="bg-white border border-slate-200 px-16 py-20 rounded-[3.5rem]">
  <div class="max-w-2xl">
    <div class="text-xs tracking-[3px] text-slate-400">CREAUNA • 2026</div>
    <h1 class="text-[64px] font-semibold tracking-[-4.5px] leading-none mt-4 text-slate-900">${lang === 'es' ? 'Diseño que<br/>se siente premium.' : 'Design that<br/>feels premium.'}</h1>
    <p class="mt-5 text-xl text-slate-600">${lang === 'es' ? 'Webs elegantes creadas con inteligencia artificial.' : 'Elegant websites built with artificial intelligence.'}</p>
    <div class="mt-8 flex gap-3">
      <a href="/templates" class="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-medium inline-block">${collection}</a>
      <a href="${demoHref}" class="px-8 py-3 border border-slate-200 rounded-2xl text-sm inline-block">${demo}</a>
    </div>
  </div>
</div>`;
}

function StudioContent() {
  const searchParams = useSearchParams();
  const { lang: globalLang, setLang: setGlobalLang } = useLanguage();
  const templateParam = searchParams.get('template');
  const projectParam = searchParams.get('project');
  const langParam = searchParams.get('lang') as Language | null;

  const [lang, setLangLocal] = useState<Language>(
    langParam === 'en' || langParam === 'es' ? langParam : globalLang
  );
  const t = translations[lang];

  const setLang = (l: Language) => {
    setLangLocal(l);
    setGlobalLang(l);
  };

  useEffect(() => {
    setLangLocal(globalLang);
  }, [globalLang]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [credits, setCredits] = useState(FREE_CREDITS);
  const [unlimitedAccess, setUnlimitedAccess] = useState(false);
  const [studioPhase, setStudioPhase] = useState<
    'onboarding' | 'discovery' | 'describe' | 'premium-starter' | 'active'
  >(
    templateParam || projectParam ? 'active' : 'onboarding'
  );
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewSections, setPreviewSections] = useState<PreviewSection[]>([
    { id: 101, type: 'hero', html: buildDefaultHero('es') },
  ]);
  const [projectName, setProjectName] = useState('Mi nueva web');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [mounted, setMounted] = useState(false);
  const [activeTemplateSlug, setActiveTemplateSlug] = useState<string | undefined>();
  const [activePremiumStarterSlug, setActivePremiumStarterSlug] = useState<string | undefined>();
  const [premiumPersonalization, setPremiumPersonalization] = useState<
    Partial<PremiumStarterPersonalization>
  >({});
  const [pendingPremiumStarterSlug, setPendingPremiumStarterSlug] = useState<string | undefined>();
  const premiumBaseHtmlRef = useRef<string | null>(null);
  const [premiumContent, setPremiumContent] = useState<PremiumStarterContent | null>(null);
  const [contentEditorTab, setContentEditorTab] = useState<PremiumEditorTab | null>(null);
  const [changeLog, setChangeLog] = useState<ChangeEntry[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotRow[]>([]);
  const [previewPulse, setPreviewPulse] = useState(false);
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);
  const [generationElapsed, setGenerationElapsed] = useState(0);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [selectedSectorLabel, setSelectedSectorLabel] = useState<string | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const templateLoadedRef = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const inlineInputRef = useRef<HTMLTextAreaElement | null>(null);

  const composerHint = useMemo(() => {
    const lastAi = [...messages].reverse().find((m) => m.role === 'ai');
    if (lastAi) return lastAi.content;
    if (studioPhase === 'onboarding') return t.welcomeOnboarding;
    if (studioPhase === 'discovery') return t.welcomeDiscovery;
    if (studioPhase === 'describe') return t.welcomeDescribe;
    return t.welcome;
  }, [messages, studioPhase, t.welcome, t.welcomeOnboarding, t.welcomeDiscovery, t.welcomeDescribe]);

  const threadMessages = useMemo(() => {
    const hasUser = messages.some((m) => m.role === 'user');
    if (!hasUser && messages.length === 1 && messages[0]?.role === 'ai') return [];

    const lastAiIndex = messages.reduce<number>((acc, m, i) => (m.role === 'ai' ? i : acc), -1);
    if (hasUser && lastAiIndex >= 0) {
      return messages.filter((_, i) => i !== lastAiIndex);
    }
    return messages;
  }, [messages]);

  const inputPlaceholder =
    studioPhase === 'describe' ? t.placeholderDescribe : t.placeholder;

  useEffect(() => {
    if (isThinking) {
      setGenerationStartedAt(Date.now());
    } else {
      setGenerationStartedAt(null);
      setGenerationElapsed(0);
    }
  }, [isThinking]);

  useEffect(() => {
    if (!isThinking || !generationStartedAt) return;
    setGenerationElapsed(Math.floor((Date.now() - generationStartedAt) / 1000));
    const tick = window.setInterval(() => {
      setGenerationElapsed(Math.floor((Date.now() - generationStartedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [isThinking, generationStartedAt]);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [threadMessages.length, isThinking]);

  useEffect(() => {
    if (studioPhase === 'describe' || studioPhase === 'active') {
      inlineInputRef.current?.focus();
    }
  }, [studioPhase]);

  useEffect(() => {
    setMounted(true);
    syncCreditsFromServer().then(({ credits: balance, unlimited }) => {
      setCredits(balance);
      setUnlimitedAccess(unlimited);
    });
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.unlimited === true || data?.user?.role === 'admin') {
          setUnlimitedAccess(true);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (projectParam && !templateLoadedRef.current) {
      templateLoadedRef.current = true;
      setStudioPhase('active');
      fetch(`/api/projects/${projectParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.project) return;
          setProjectId(data.project.id);
          setProjectName(data.project.name);
          setPreviewSections(data.project.sections);
          setChangeLog(data.project.changeLog ?? []);
          if (Array.isArray(data.project.messages) && data.project.messages.length > 0) {
            setMessages(
              data.project.messages.map((m: { role: string; content: string }, i: number) => ({
                id: i + 1,
                role: m.role === 'user' ? 'user' : 'ai',
                content: m.content,
              }))
            );
          } else {
            setMessages([
              {
                id: 1,
                role: 'ai',
                content: lang === 'es' ? `Proyecto «${data.project.name}» cargado.` : `Project «${data.project.name}» loaded.`,
              },
            ]);
          }
          if (data.project.templateSlug) setActiveTemplateSlug(data.project.templateSlug);
          if (data.project.lang === 'en' || data.project.lang === 'es') setLangLocal(data.project.lang);
        })
        .catch(() => undefined);
      return;
    }
    if (!mounted || templateLoadedRef.current) return;
    if (templateParam) {
      const tpl = getTemplateBySlug(templateParam);
      if (tpl) {
        templateLoadedRef.current = true;
        setStudioPhase('active');
        try {
          const loaded = loadCatalogTemplate(tpl.slug, lang);
          setPreviewSections(loaded.previewSections);
          setProjectName(loaded.businessName);
          setActiveTemplateSlug(loaded.template.slug);
          setMessages([
            {
              id: 1,
              role: 'ai',
              content:
                lang === 'es'
                  ? `Plantilla «${tpl.nameEs}» cargada con: ${loaded.sectionsSummary}. Navega la vista en tiempo real y dime qué quieres mejorar.`
                  : `Template «${tpl.nameEn}» loaded with: ${loaded.sectionsSummary}. Browse the live preview and tell me what to improve.`,
            },
          ]);
          setChangeLog([
            {
              id: Date.now(),
              summary:
                lang === 'es'
                  ? `Plantilla ${tpl.nameEs} — web completa generada`
                  : `Template ${tpl.nameEn} — full site generated`,
              time: new Date().toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
        } catch {
          setMessages([
            {
              id: 1,
              role: 'ai',
              content: t.welcomeTemplate(lang === 'es' ? tpl.nameEs : tpl.nameEn),
            },
          ]);
        }
        return;
      }
    }
    if (studioPhase === 'onboarding') {
      setMessages([{ id: 1, role: 'ai', content: t.welcomeOnboarding }]);
      return;
    }
    if (studioPhase === 'describe') {
      setMessages([{ id: 1, role: 'ai', content: t.welcomeDescribe }]);
      setPreviewSections([{ id: 101, type: 'hero', html: buildDescribePlaceholder(lang) }]);
    }
  }, [mounted, templateParam, projectParam, lang, studioPhase, t.welcomeOnboarding, t.welcomeDescribe, t.welcomeTemplate]);

  const handleChoosePremiumStarter = (slug: string) => {
    setPendingPremiumStarterSlug(slug);
    setStudioPhase('premium-starter');
    const starter = getPremiumStarterBySlug(slug);
    setMessages([
      {
        id: 1,
        role: 'ai',
        content:
          lang === 'es'
            ? `Muestra «${starter?.nameEs ?? slug}» seleccionada. Rellena los datos de tu negocio.`
            : `Sample «${starter?.nameEn ?? slug}» selected. Fill in your business details.`,
      },
    ]);
  };

  const handlePremiumStarterComplete = async (data: PremiumStarterPersonalization) => {
    if (!pendingPremiumStarterSlug) return;
    setIsThinking(true);
    try {
      const loaded = await loadPremiumStarter(pendingPremiumStarterSlug, lang, data);
      setPreviewSections(loaded.previewSections);
      setProjectName(loaded.businessName);
      setActivePremiumStarterSlug(loaded.starter.slug);
      setActiveTemplateSlug(loaded.starter.catalogTemplateSlug);
      setSelectedSectorId(loaded.starter.sectorId);
      setPremiumPersonalization(data);
      premiumBaseHtmlRef.current = loaded.baseHtml;
      setPremiumContent(normalizePremiumContent(loaded.content));
      setStudioPhase('active');
      setMessages([
        {
          id: 1,
          role: 'ai',
          content: t.welcomePremium(loaded.businessName),
        },
      ]);
      setChangeLog([
        {
          id: Date.now(),
          summary:
            lang === 'es'
              ? `Muestra premium ${loaded.starter.nameEs} — ${loaded.businessName}`
              : `Premium sample ${loaded.starter.nameEn} — ${loaded.businessName}`,
          time: new Date().toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      scheduleSave(loaded.previewSections, [], loaded.businessName, [
        { id: 1, role: 'ai', content: t.welcomePremium(loaded.businessName) },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const rebuildPremiumPreview = useCallback(
    (personalization: Partial<PremiumStarterPersonalization>, content: PremiumStarterContent) => {
      const slug = activePremiumStarterSlug;
      const base = premiumBaseHtmlRef.current;
      const starter = slug ? getPremiumStarterBySlug(slug) : undefined;
      if (!slug || !base || !starter) return null;
      return buildPremiumStarterHtml(base, starter, personalization, content);
    },
    [activePremiumStarterSlug]
  );

  const handlePremiumContentSave = async (content: PremiumStarterContent, savedTab: PremiumEditorTab) => {
    const personalization: Partial<PremiumStarterPersonalization> = {
      ...premiumPersonalization,
      businessName: projectName,
    };
    const normalized = normalizePremiumContent(content);
    const html = rebuildPremiumPreview(personalization, normalized);
    if (!html) return;

    setPremiumContent(normalized);
    setPreviewSections([{ id: 1, type: 'fullpage', html }]);
    setContentEditorTab(null);

    const summaryByTab: Record<PremiumEditorTab, { es: string; en: string }> = {
      menu: { es: 'Carta actualizada', en: 'Menu updated' },
      highlights: { es: 'Destacados actualizados', en: 'Highlights updated' },
      daily: { es: 'Menús del día actualizados', en: 'Daily menus updated' },
      info: { es: 'Información actualizada', en: 'Info updated' },
      football: { es: 'Sección de fútbol actualizada', en: 'Football section updated' },
      digital: { es: 'Carta QR y reservas actualizadas', en: 'QR menu and booking updated' },
      gallery: { es: 'Galería actualizada', en: 'Gallery updated' },
    };
    const summary = lang === 'es' ? summaryByTab[savedTab].es : summaryByTab[savedTab].en;
    const nextLog = addChange(summary);
    scheduleSave([{ id: 1, type: 'fullpage', html }], nextLog, projectName);
    flashSections([1]);

    const shouldSyncPedir =
      activePremiumStarterSlug === 'meson-la-colonia' &&
      normalized.digital.orderingEnabled &&
      normalized.menu.some((c) => c.items.some((i) => i.name.trim()));

    if (shouldSyncPedir) {
      try {
        const syncRes = await fetch('/api/studio/sync-premium-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            premiumStarterSlug: activePremiumStarterSlug,
            premiumContent: normalized,
            premiumPersonalization: personalization,
          }),
        });
        const syncData = await syncRes.json();
        if (syncData.synced?.includes('pedir.html')) {
          toast.success(
            lang === 'es'
              ? 'Cambios aplicados · pedir.html actualizado'
              : 'Changes applied · pedir.html updated'
          );
          return;
        }
      } catch {
        /* pedir sync is best-effort; export still includes pedir.html */
      }
    }

    toast.success(lang === 'es' ? 'Cambios aplicados a la vista previa' : 'Changes applied to preview');
  };

  const loadSnapshots = useCallback(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/snapshots`)
      .then((r) => r.json())
      .then((data) => setSnapshots(data.snapshots ?? []))
      .catch(() => undefined);
  }, [projectId]);

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots, changeLog.length]);

  const previewImpact = async (
    payload: Record<string, unknown>
  ): Promise<StudioImpact | null> => {
    try {
      const res = await fetch('/api/studio/preview-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          previewSections: previewSections.map((s) => ({ id: s.id, type: s.type })),
          ...payload,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.impact ?? null;
    } catch {
      return null;
    }
  };

  const confirmImpactIfNeeded = async (impact: StudioImpact | null): Promise<boolean> => {
    if (!impact || impact.risk === 'low') return true;
    const reason = lang === 'es' ? impact.reasonEs : impact.reasonEn;
    return window.confirm(`${reason}\n\n${t.confirmContinue}`);
  };

  const restoreSnapshot = async (snapshotId: string) => {
    if (!projectId) return;
    const ok = window.confirm(
      lang === 'es' ? '¿Restaurar esta versión del diseño?' : 'Restore this design version?'
    );
    if (!ok) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/snapshots/${snapshotId}/restore`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setPreviewSections(data.sections);
      setChangeLog(data.changeLog ?? []);
      loadSnapshots();
      toast.success(t.restored);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleChooseDiscovery = () => {
    setStudioPhase('discovery');
    setProjectName(lang === 'es' ? 'Mi nueva web' : 'My new website');
    setPreviewSections([{ id: 101, type: 'hero', html: buildDescribePlaceholder(lang) }]);
    setMessages([
      {
        id: 1,
        role: 'ai',
        content: t.welcomeDiscovery,
      },
    ]);
  };

  const handleChooseFreeText = () => {
    setStudioPhase('describe');
    setProjectName(lang === 'es' ? 'Mi nueva web' : 'My new website');
    setPreviewSections([{ id: 101, type: 'hero', html: buildDescribePlaceholder(lang) }]);
    setMessages([
      {
        id: 1,
        role: 'ai',
        content: t.welcomeDescribe,
      },
    ]);
  };

  const handleDiscoveryComplete = async (answers: StudioDiscoveryAnswers) => {
    if (!(await ensureCredits())) return;
    setIsThinking(true);
    setProjectName(answers.businessName);
    setActiveTemplateSlug(answers.templateSlug);
    setSelectedSectorId(answers.sectorId);
    try {
      const data = await callStudioApi({
        prompt: answers.businessName,
        action: 'initial',
        discovery: answers,
      });
      setPreviewSections(data.previewSections);
      setStudioPhase('active');
      if (data.templateSlug) setActiveTemplateSlug(data.templateSlug);
      if (data.sectorId) setSelectedSectorId(data.sectorId);
      if (data.sectorLabel) setSelectedSectorLabel(data.sectorLabel);
      applyCreditFromResponse(data.credits);

      const summary = lang === 'es' ? 'Web creada con asistente' : 'Site created with assistant';
      const nextLog = addChange(summary);
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', content: data.message };
      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        scheduleSave(data.previewSections, nextLog, answers.businessName, updated);
        return updated;
      });
      loadSnapshots();
      flashSections(data.changedSectionIds ?? []);
      toast.success(t.changeApplied, { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const handleChooseDescribe = handleChooseDiscovery;

  const addChange = (summary: string, prev?: ChangeEntry[]) => {
    const base = prev ?? changeLog;
    const nextLog: ChangeEntry[] = [
      {
        id: Date.now(),
        summary,
        time: new Date().toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      },
      ...base.slice(0, 9),
    ];
    setChangeLog(nextLog);
    setPreviewPulse(true);
    setTimeout(() => setPreviewPulse(false), 1200);
    return nextLog;
  };

  const ensureCredits = useCallback(async (): Promise<boolean> => {
    if (unlimitedAccess) return true;
    const sync = await syncCreditsFromServer();
    if (sync.unlimited) {
      setUnlimitedAccess(true);
      return true;
    }
    setCredits(sync.credits);
    setCreditsCache(sync.credits);
    if (sync.credits <= 0) {
      toast.error(t.noCredits);
      return false;
    }
    return true;
  }, [unlimitedAccess, t.noCredits]);

  const applyCreditFromResponse = useCallback((balance?: number) => {
    if (unlimitedAccess) return;
    if (typeof balance === 'number') {
      setCredits(balance);
      setCreditsCache(balance);
    } else {
      syncCreditsFromServer().then(({ credits: c, unlimited }) => {
        setCredits(c);
        setCreditsCache(c);
        setUnlimitedAccess(unlimited);
      });
    }
  }, [unlimitedAccess]);

  const persistProject = useCallback(
    async (sections: PreviewSection[], log: ChangeEntry[], name: string, chatMessages?: Message[]) => {
      try {
        const me = await fetch('/api/auth/me');
        if (!me.ok) return;
        const msgs = (chatMessages ?? messages).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const payload = { name, sections, changeLog: log, messages: msgs, templateSlug: activeTemplateSlug, lang };
        if (projectId) {
          await fetch(`/api/projects/${projectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (data.project?.id) setProjectId(data.project.id);
        }
      } catch {
        /* silent */
      }
    },
    [projectId, activeTemplateSlug, lang, messages]
  );

  const scheduleSave = useCallback(
    (sections: PreviewSection[], log: ChangeEntry[], name: string, chatMessages?: Message[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => persistProject(sections, log, name, chatMessages), 800);
    },
    [persistProject]
  );

  const chatPayload = useCallback(
    () => messages.map((m) => ({ role: m.role, content: m.content })),
    [messages]
  );

  const callStudioApi = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/studio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang,
        previewSections,
        projectId,
        changeLog,
        messages: chatPayload(),
        sectorId: selectedSectorId ?? undefined,
        templateSlug: activeTemplateSlug ?? undefined,
        premiumStarterSlug: activePremiumStarterSlug ?? undefined,
        premiumPersonalization:
          Object.keys(premiumPersonalization).length > 0 ? premiumPersonalization : undefined,
        premiumContent: premiumContent ?? undefined,
        businessName: projectName?.trim() || undefined,
        ...payload,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 402) {
        const bal = typeof data.credits === 'number' ? data.credits : 0;
        setCredits(bal);
        setCreditsCache(bal);
      }
      if (typeof data.credits === 'number') {
        setCredits(data.credits);
        setCreditsCache(data.credits);
      }
      const errText = data.error || 'Error en el Studio';
      if (res.status === 422 && errText.includes('No hubo cambio visible')) {
        throw new Error(errText);
      }
      if (res.status === 422 && errText.includes('No visible change')) {
        throw new Error(errText);
      }
      if (res.status === 422 && data.snapshotId) {
        throw new Error(
          lang === 'es'
            ? `${errText}. Usa «Restaurar versión» en el historial.`
            : `${errText}. Use «Restore version» in history.`
        );
      }
      throw new Error(errText);
    }
    if (typeof data.credits === 'number') {
      setCredits(data.credits);
      setCreditsCache(data.credits);
    }
    if (data.unlimited === true) setUnlimitedAccess(true);
    return data as {
      message: string;
      previewSections: PreviewSection[];
      changedSectionIds?: number[];
      credits?: number;
      unlimited?: boolean;
      templateSlug?: string;
      businessName?: string;
      sectorId?: string;
      sectorLabel?: string;
      diffSummary?: string;
    };
  };

  const flashSections = (ids: number[]) => {
    if (ids.length === 0) return;
    setHighlightedIds(ids);
    setTimeout(() => setHighlightedIds([]), 2500);
    const first = sectionRefs.current[ids[0]];
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const processAIChange = async (currentInput: string, action: 'change' | 'regenerate' | 'improve' | 'initial' = 'change', sectionId?: number) => {
    try {
      const isInitialGeneration = studioPhase === 'describe';
      const data = await callStudioApi({
        prompt: currentInput,
        action: isInitialGeneration ? 'initial' : action,
        sectionId: sectionId ?? selectedSectionId ?? undefined,
      });

      setPreviewSections(data.previewSections);
      if (studioPhase === 'describe') setStudioPhase('active');
      if (data.templateSlug) setActiveTemplateSlug(data.templateSlug);
      if (data.businessName) setProjectName(data.businessName);
      if (data.sectorId) setSelectedSectorId(data.sectorId);
      if (data.sectorLabel) setSelectedSectorLabel(data.sectorLabel);
      applyCreditFromResponse(data.credits);

      const summary = currentInput.slice(0, 60) + (currentInput.length > 60 ? '…' : '');
      const nextLog = addChange(summary);

      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', content: data.message };
      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        scheduleSave(data.previewSections, nextLog, projectName, updated);
        return updated;
      });

      loadSnapshots();
      flashSections(data.changedSectionIds ?? []);
      toast.success(t.changeApplied, {
        description: data.diffSummary ? `${t.creditUsed} · ${data.diffSummary}` : t.creditUsed,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al generar';
      if (msg.includes('No hubo cambio visible') || msg.includes('No visible change')) {
        toast.info(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    if (studioPhase === 'onboarding' || studioPhase === 'discovery') {
      toast.info(
        lang === 'es'
          ? 'Completa el asistente en el panel derecho o elige plantilla.'
          : 'Complete the assistant in the right panel or pick a template.'
      );
      return;
    }
    if (!(await ensureCredits())) return;

    const isInitialGeneration = studioPhase === 'describe';
    const impact = await previewImpact({
      prompt: input.trim(),
      action: isInitialGeneration ? 'initial' : 'change',
      sectionId: selectedSectionId ?? undefined,
    });
    if (!(await confirmImpactIfNeeded(impact))) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsThinking(true);
    await processAIChange(currentInput);
  };

  const applyQuickPrompt = async (prompt: string) => {
    if (studioPhase === 'onboarding' || studioPhase === 'discovery') {
      toast.info(
        lang === 'es'
          ? 'Completa el asistente en el panel derecho o elige plantilla.'
          : 'Complete the assistant in the right panel or pick a template.'
      );
      return;
    }
    if (!(await ensureCredits())) return;
    const impact = await previewImpact({
      prompt,
      action: 'change',
      sectionId: selectedSectionId ?? undefined,
    });
    if (!(await confirmImpactIfNeeded(impact))) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: prompt }]);
    setInput('');
    setIsThinking(true);
    await processAIChange(prompt);
  };

  const regenerate = async () => {
    if (studioPhase === 'onboarding') return;
    if (!(await ensureCredits())) return;
    const impact = await previewImpact({ prompt: 'regenerar', action: 'regenerate' });
    if (!(await confirmImpactIfNeeded(impact))) return;
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: 'regenerar', action: 'regenerate' });
      setPreviewSections(data.previewSections);
      applyCreditFromResponse(data.credits);
      const summary = lang === 'es' ? 'Regeneración completa' : 'Full regeneration';
      const nextLog = addChange(summary);
      scheduleSave(data.previewSections, nextLog, projectName);
      loadSnapshots();
      flashSections(data.changedSectionIds ?? data.previewSections.map((s) => s.id));
      toast.success(lang === 'es' ? 'Nuevas variaciones' : 'New variations', { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const improveSection = async (id: number) => {
    if (studioPhase === 'onboarding') return;
    if (!(await ensureCredits())) return;
    setSelectedSectionId(id);
    const impact = await previewImpact({ prompt: 'mejorar sección', action: 'improve', sectionId: id });
    if (!(await confirmImpactIfNeeded(impact))) return;
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: 'mejorar sección', action: 'improve', sectionId: id });
      setPreviewSections(data.previewSections);
      applyCreditFromResponse(data.credits);
      const summary = lang === 'es' ? `Sección #${id} mejorada` : `Section #${id} improved`;
      const nextLog = addChange(summary);
      scheduleSave(data.previewSections, nextLog, projectName);
      flashSections(data.changedSectionIds ?? [id]);
      toast.success(lang === 'es' ? 'Sección mejorada' : 'Section improved', { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const sectionLabel = (type: string) => {
    const key = type as keyof typeof t.sections;
    return t.sections[key] ?? type;
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/studio/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          previewSections,
          premiumStarterSlug: activePremiumStarterSlug ?? undefined,
          premiumContent: premiumContent ?? undefined,
          premiumPersonalization: premiumPersonalization ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al exportar');
      const files = data.files as Record<string, string> | undefined;
      const slug = projectName.replace(/\s+/g, '-').toLowerCase();
      if (files && Object.keys(files).length > 1) {
        for (const [name, content] of Object.entries(files)) {
          const blob = new Blob([content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = name === 'index.html' ? `${slug}.html` : name;
          a.click();
          URL.revokeObjectURL(url);
        }
        toast.success(
          lang === 'es'
            ? 'Exportados index.html y pedir.html'
            : 'Exported index.html and pedir.html'
        );
        return;
      }
      const html = files?.['index.html'] || '';
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(lang === 'es' ? 'Exportado como código limpio' : 'Exported as clean code');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al exportar');
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden font-sans">
      <div className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-2xl z-50 flex items-center px-6 text-sm shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" /> {lang === 'es' ? 'Volver' : 'Back'}
          </Link>
          <div className="w-6 h-6 rounded-lg overflow-hidden ring-1 ring-slate-200">
            <img src="/images/logo.png" alt="CREAUNA" className="w-full h-full object-cover" />
          </div>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent font-semibold tracking-tight text-xl focus:outline-none w-[200px] md:w-[260px]"
          />
          {activePremiumStarterSlug ? (
            <a
              href={`/demos/starters/${activePremiumStarterSlug}/index.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800"
            >
              <Eye className="w-3 h-3" />
              {lang === 'es' ? 'Muestra premium' : 'Premium sample'}
            </a>
          ) : activeTemplateSlug ? (
            <Link
              href={`/templates/preview/${activeTemplateSlug}`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700"
            >
              <Eye className="w-3 h-3" />
              {t.templateLoaded}
            </Link>
          ) : null}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
            <Coins className="w-3.5 h-3.5" />
            {unlimitedAccess ? t.unlimitedAccess : `${credits} ${t.creditsLeft}`}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center border border-slate-200 rounded-2xl bg-white mr-1">
            <button onClick={() => setLang('es')} className={`px-3 py-1 rounded-2xl text-xs cursor-pointer ${lang === 'es' ? 'bg-slate-900 text-white' : ''}`}>ES</button>
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-2xl text-xs cursor-pointer ${lang === 'en' ? 'bg-slate-900 text-white' : ''}`}>EN</button>
          </div>
          {activePremiumStarterSlug && studioPhase === 'active' && (
            <div className="hidden xl:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setContentEditorTab('menu')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Carta' : 'Menu'}
              </button>
              <button
                type="button"
                onClick={() => setContentEditorTab('highlights')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <Star className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Destacados' : 'Highlights'}
              </button>
              <button
                type="button"
                onClick={() => setContentEditorTab('daily')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Menús' : 'Daily'}
              </button>
              <button
                type="button"
                onClick={() => setContentEditorTab('info')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <Info className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Info' : 'Info'}
              </button>
              <button
                type="button"
                onClick={() => setContentEditorTab('football')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <Trophy className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Fútbol' : 'Football'}
              </button>
              <button
                type="button"
                onClick={() => setContentEditorTab('digital')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <ScanLine className="w-3.5 h-3.5" />
                {lang === 'es' ? 'QR / 24h' : 'QR / 24h'}
              </button>
              <button
                type="button"
                onClick={() => setContentEditorTab('gallery')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer text-[11px]"
              >
                <Image className="w-3.5 h-3.5" aria-hidden="true" />
                {lang === 'es' ? 'Galería' : 'Gallery'}
              </button>
            </div>
          )}
          <button onClick={regenerate} className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-2xl border border-slate-200 hover:bg-slate-100 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> {t.regenerate}
          </button>
          <button onClick={() => toast(lang === 'es' ? 'Enlace de preview copiado' : 'Preview link copied')} className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-2xl border border-slate-200 hover:bg-slate-100 cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> {t.share}
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-1.5 rounded-2xl border border-slate-200 hover:bg-slate-100 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> {t.export}
          </button>
          <button
            onClick={() => setCheckoutOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded-2xl font-medium cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" /> {t.finalize}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[min(340px,32vw)] flex flex-col border-r border-slate-200 bg-white shrink-0 min-h-0">
          {contentEditorTab && premiumContent && activePremiumStarterSlug ? (
            <StudioPremiumContentEditor
              lang={lang}
              tab={contentEditorTab}
              content={premiumContent}
              onTabChange={setContentEditorTab}
              onBack={() => setContentEditorTab(null)}
              onSave={handlePremiumContentSave}
              isSaving={isThinking}
            />
          ) : (
            <>
          {/* Cabecera Studio */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-slate-200">
                <img src="/images/logo.png" alt="Studio" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold tracking-tight text-xl">{t.title}</div>
                <div className="text-xs text-slate-500">{t.subtitle}</div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1 · Conversación (IA + cliente) */}
          <div className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
            <p className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 uppercase mb-3">
              {lang === 'es' ? 'Conversación' : 'Conversation'}
            </p>
            {studioPhase === 'onboarding' || studioPhase === 'discovery' ? (
              <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3.5 text-[14px] leading-relaxed text-slate-700">
                {studioPhase === 'discovery' ? t.welcomeDiscovery : t.welcomeOnboarding}
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3.5 shadow-sm">
                {activePremiumStarterSlug && studioPhase === 'active' && (
                  <div className="grid grid-cols-2 gap-2 mb-3 xl:hidden">
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('menu')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'Carta' : 'Menu'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('highlights')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'Destacados' : 'Highlights'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('daily')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'Menús' : 'Daily'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('info')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'Info' : 'Info'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('football')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'Fútbol' : 'Football'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('digital')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'QR / 24h' : 'QR / 24h'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('gallery')}
                      className="text-xs py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 cursor-pointer"
                    >
                      {lang === 'es' ? 'Galería' : 'Gallery'}
                    </button>
                  </div>
                )}
                <p className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap">{composerHint}</p>
                <textarea
                  ref={inlineInputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={studioPhase === 'describe' ? 5 : 3}
                  placeholder={studioPhase === 'describe' ? '' : inputPlaceholder}
                  disabled={isThinking}
                  className="w-full mt-1 bg-transparent text-[14px] leading-relaxed text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none min-h-[5.5rem] disabled:opacity-50"
                />
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 leading-snug">
                    {unlimitedAccess ? t.unlimitedAccess : `${credits} ${t.creditsLeft}`}
                    <span className="hidden sm:inline">
                      {' · '}
                      {lang === 'es' ? 'Enter enviar · Shift+Enter nueva línea' : 'Enter send · Shift+Enter new line'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!input.trim() || isThinking}
                    className="w-9 h-9 shrink-0 bg-slate-900 rounded-xl flex items-center justify-center text-white disabled:opacity-40 cursor-pointer"
                    aria-label={lang === 'es' ? 'Enviar' : 'Send'}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 2 · Resto (sugerencias, historial, cambios…) */}
          <div ref={chatScrollRef} className="flex-1 overflow-auto px-5 py-4 min-h-0 flex flex-col gap-4 text-[14px] bg-white">
            {studioPhase !== 'onboarding' && studioPhase !== 'discovery' && (
              <div className="shrink-0">
                <div className="text-[10px] tracking-widest text-slate-400 mb-2">{lang === 'es' ? 'SUGERENCIAS' : 'SUGGESTIONS'}</div>
                <div className="flex flex-wrap gap-1.5">
                  {t.quickPrompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyQuickPrompt(p)}
                      disabled={isThinking}
                      className="text-[11px] px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-40 cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {threadMessages.length > 0 && (
              <div className="shrink-0">
                <div className="text-[10px] tracking-widest text-slate-400 mb-2">
                  {lang === 'es' ? 'HISTORIAL' : 'HISTORY'}
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {threadMessages.map((msg) => (
                      <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : ''}>
                        <div
                          className={
                            msg.role === 'user'
                              ? 'max-w-[90%] rounded-2xl rounded-br-md bg-indigo-600 text-white px-4 py-3 text-[14px] leading-relaxed'
                              : 'max-w-[95%] rounded-2xl rounded-bl-md bg-slate-100 text-slate-800 px-4 py-3 text-[14px] leading-relaxed'
                          }
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {isThinking && (
              <div className="flex items-center gap-2 px-1 text-sm text-indigo-600 shrink-0 font-medium">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>
                  {t.thinking}
                  {isThinking ? ` · ${generationElapsed}s` : ''}
                </span>
              </div>
            )}

            {studioPhase === 'onboarding' && (
              <p className="text-xs text-slate-400 text-center py-4">
                {lang === 'es'
                  ? 'Describe tu proyecto abajo o elige asistente / plantilla.'
                  : 'Describe your project below or pick assistant / template.'}
              </p>
            )}

            <div className="mt-auto shrink-0 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[10px] tracking-widest text-slate-400 mb-2">
                <History className="w-3 h-3" />
                {t.changes}
              </div>
              {changeLog.length === 0 ? (
                <p className="text-xs text-slate-400">{t.noChanges}</p>
              ) : (
                <ul className="space-y-1.5 max-h-24 overflow-y-auto">
                  {changeLog.map((entry) => (
                    <li key={entry.id} className="text-xs text-slate-600 flex justify-between gap-2">
                      <span className="truncate">{entry.summary}</span>
                      <span className="text-slate-400 shrink-0">{entry.time}</span>
                    </li>
                  ))}
                </ul>
              )}
              {projectId && snapshots.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[10px] tracking-widest text-slate-400 mb-1.5">{t.snapshots}</div>
                  <ul className="space-y-1 max-h-20 overflow-y-auto">
                    {snapshots.slice(0, 5).map((snap) => (
                      <li key={snap.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate text-slate-600">
                          v{snap.versionNumber}
                          {snap.label ? ` · ${snap.label}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => restoreSnapshot(snap.id)}
                          className="shrink-0 text-indigo-600 hover:underline cursor-pointer"
                        >
                          {t.restore}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-between mt-3 text-[10px] text-slate-400">
                <span>{t.creditHint}</span>
                <Link href="/guia" className="text-indigo-600 hover:underline">{lang === 'es' ? 'Ver guía' : 'View guide'}</Link>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        <div className="flex-1 bg-slate-100 p-4 md:p-6 overflow-auto min-w-0 flex flex-col">
          <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3 px-1 shrink-0">
              <div className="flex items-center gap-4">
                <div className="font-medium tracking-tight text-xl">{projectName}</div>
                <div className="text-xs px-3 py-px rounded-full border font-semibold bg-amber-50 border-amber-200 text-amber-700">
                  {t.draft}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-indigo-600 uppercase">
                  <span className={`w-2 h-2 rounded-full ${isThinking ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
                  {t.livePreview}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex text-xs border border-slate-200 rounded-2xl bg-white p-1 flex-wrap">
                  {previewSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        sectionRefs.current[sec.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`px-3 py-1.5 rounded-[14px] transition cursor-pointer text-[11px] ${selectedSectionId === sec.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}
                    >
                      {sectionLabel(sec.type)}
                    </button>
                  ))}
                </div>
                <div className="flex text-xs border border-slate-200 rounded-2xl bg-white p-1">
                  <button onClick={() => setViewMode('desktop')} className={`px-4 py-1.5 flex items-center gap-2 rounded-[14px] cursor-pointer ${viewMode === 'desktop' ? 'bg-slate-900 text-white' : ''}`}>
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setViewMode('mobile')} className={`px-4 py-1.5 flex items-center gap-2 rounded-[14px] cursor-pointer ${viewMode === 'mobile' ? 'bg-slate-900 text-white' : ''}`}>
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {selectedSectionId && (
              <p className="text-xs text-indigo-600 font-medium mb-2 px-1 shrink-0">{t.selectSection}: {sectionLabel(previewSections.find((s) => s.id === selectedSectionId)?.type ?? '')}</p>
            )}

            <motion.div
              animate={previewPulse ? { boxShadow: '0 0 0 4px rgba(99,102,241,0.45)' } : { boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18)' }}
              className={`relative mx-auto bg-white transition-all border border-slate-200 flex-1 w-full overflow-hidden ${viewMode === 'mobile' ? 'max-w-[390px] rounded-[2.5rem]' : 'max-w-full rounded-[2.5rem]'} ${isThinking ? 'ring-2 ring-indigo-300 ring-offset-2' : ''}`}
            >
              {isThinking && generationStartedAt && (
                <StudioGenerationProgress lang={lang} startedAt={generationStartedAt} />
              )}
              {studioPhase === 'onboarding' ? (
                <StudioOnboarding
                  lang={lang}
                  onChoosePrompt={handleChooseFreeText}
                  onChooseWizard={handleChooseDiscovery}
                />
              ) : studioPhase === 'premium-starter' && pendingPremiumStarterSlug ? (
                <StudioPremiumStarterForm
                  lang={lang}
                  starterSlug={pendingPremiumStarterSlug}
                  onBack={() => {
                    setPendingPremiumStarterSlug(undefined);
                    setStudioPhase('onboarding');
                    setMessages([{ id: 1, role: 'ai', content: t.welcomeOnboarding }]);
                  }}
                  onComplete={handlePremiumStarterComplete}
                />
              ) : studioPhase === 'discovery' ? (
                <StudioDiscoveryWizard
                  lang={lang}
                  onComplete={handleDiscoveryComplete}
                  onFreeText={handleChooseFreeText}
                  isGenerating={isThinking}
                />
              ) : studioPhase === 'describe' && !isThinking && previewSections.length === 1 && (previewSections[0]?.html.includes('Tu web aparecerá') || previewSections[0]?.html.includes('Your site will appear')) ? (
                <div className="p-6 md:p-10">
                  <div dangerouslySetInnerHTML={{ __html: previewSections[0].html }} />
                </div>
              ) : (
                <StudioSectionPreview
                  sections={previewSections}
                  viewMode={viewMode}
                  lang={lang}
                  selectedSectionId={selectedSectionId}
                  highlightedIds={highlightedIds}
                  isThinking={isThinking}
                  improveLabel={t.improve}
                  sectionRefs={sectionRefs}
                  onSelectSection={setSelectedSectionId}
                  onImproveSection={improveSection}
                />
              )}
            </motion.div>

            <div className="text-center text-xs text-slate-400 mt-4 tracking-widest shrink-0 pb-2">
              {t.livePreview} • {t.instant}
            </div>
          </div>
        </div>
      </div>

      <StudioCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        lang={lang}
        projectName={projectName}
        onPaymentComplete={() => toast.info(lang === 'es' ? 'Pagos disponibles próximamente' : 'Payments coming soon')}
      />
    </div>
  );
}

export default function CreaunaStudio() {
  return (
    <Suspense fallback={null}>
      <StudioContent />
    </Suspense>
  );
}
