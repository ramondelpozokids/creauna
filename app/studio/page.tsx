'use client';

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, Sparkles, RefreshCw, Download, Share2,
  Monitor, Smartphone, Zap, Coins, Rocket, History, Eye
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StudioCheckoutModal from '../components/StudioCheckoutModal';
import StudioOnboarding from '../components/StudioOnboarding';
import { useLanguage } from '../components/LanguageProvider';
import { getCredits, syncCreditsFromServer, FREE_CREDITS } from '../lib/studioCredits';
import { getTemplateBySlug } from '../data/templates';
import { buildTemplateSections, toStudioSections } from '../lib/templatePages';

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
    welcomeOnboarding: 'Bienvenido al Studio. Antes de diseñar, elige cómo quieres empezar en el panel de la derecha: una plantilla del catálogo o describe tu web desde cero.',
    welcomeDescribe: 'Perfecto. Cuéntame tu negocio: sector, estilo visual, secciones que necesitas (contacto, menú, reservas…) y crearé tu primera versión.',
    welcomeTemplate: (name: string) => `Plantilla «${name}» cargada. Navega la vista en tiempo real a la derecha y dime qué quieres mejorar.`,
    placeholder: 'Describe lo que quieres cambiar...',
    regenerate: 'Regenerar',
    share: 'Compartir',
    export: 'Exportar',
    finalize: 'Finalizar y pagar',
    styles: ['Elegante', 'Minimal', 'Moderno'],
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
    creditUsed: '1 crédito (~0,16€ en Pro)',
    creditHint: '1 cambio = 1 crédito · Gratis: 0€ · Pro: ~0,16€/cambio',
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
    sections: { hero: 'Inicio', menu: 'Menú', services: 'Servicios', about: 'Sobre nosotros', gallery: 'Galería', reviews: 'Reseñas', location: 'Ubicación', blog: 'Blog', reservation: 'Reservas', contact: 'Contacto', footer: 'Legal', widgets: 'Accesos', testimonial: 'Testimonios' },
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
    welcomeOnboarding: 'Welcome to the Studio. Before we design, choose how to start in the panel on the right: a catalog template or describe your site from scratch.',
    welcomeDescribe: 'Great. Tell me about your business: industry, visual style, sections you need (contact, menu, booking…) and I will build your first version.',
    welcomeTemplate: (name: string) => `Template «${name}» loaded. Check the live preview on the right and tell me what to improve.`,
    placeholder: 'Describe what you want to change...',
    regenerate: 'Regenerate',
    share: 'Share',
    export: 'Export',
    finalize: 'Finalize & pay',
    styles: ['Elegant', 'Minimal', 'Modern'],
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
    creditUsed: '1 credit (~€0.16 on Pro)',
    creditHint: '1 change = 1 credit · Free: €0 · Pro: ~€0.16/change',
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
    sections: { hero: 'Home', menu: 'Menu', services: 'Services', about: 'About us', gallery: 'Gallery', reviews: 'Reviews', location: 'Location', blog: 'Blog', reservation: 'Booking', contact: 'Contact', footer: 'Legal', widgets: 'Shortcuts', testimonial: 'Testimonials' },
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
  <p class="mt-2 text-sm">${lang === 'es' ? 'Describe tu proyecto en el chat ←' : 'Describe your project in the chat ←'}</p>
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
  const [studioPhase, setStudioPhase] = useState<'onboarding' | 'describe' | 'active'>(
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
  const [style, setStyle] = useState<'elegante' | 'minimal' | 'moderno'>('elegante');
  const [mounted, setMounted] = useState(false);
  const [activeTemplateSlug, setActiveTemplateSlug] = useState<string | undefined>();
  const [changeLog, setChangeLog] = useState<ChangeEntry[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotRow[]>([]);
  const [previewPulse, setPreviewPulse] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const templateLoadedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    syncCreditsFromServer().then(({ credits: balance, unlimited }) => {
      setCredits(balance);
      setUnlimitedAccess(unlimited);
    });
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
        const sections = toStudioSections(buildTemplateSections(tpl, lang));
        setPreviewSections(sections);
        setProjectName(lang === 'es' ? tpl.nameEs : tpl.nameEn);
        setActiveTemplateSlug(tpl.slug);
        setMessages([
          {
            id: 1,
            role: 'ai',
            content: t.welcomeTemplate(lang === 'es' ? tpl.nameEs : tpl.nameEn),
          },
        ]);
        setChangeLog([
          {
            id: Date.now(),
            summary: lang === 'es' ? `Plantilla ${tpl.nameEs} cargada` : `Template ${tpl.nameEn} loaded`,
            time: new Date().toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
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

  const handleChooseDescribe = () => {
    setStudioPhase('describe');
    setProjectName(lang === 'es' ? 'Mi nueva web' : 'My new website');
  };

  const addChange = (summary: string) => {
    setChangeLog((prev) => [
      {
        id: Date.now(),
        summary,
        time: new Date().toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 9),
    ]);
    setPreviewPulse(true);
    setTimeout(() => setPreviewPulse(false), 1200);
  };

  const checkCredits = useCallback((): boolean => {
    if (unlimitedAccess) return true;
    if (getCredits() <= 0) {
      toast.error(t.noCredits);
      return false;
    }
    return true;
  }, [unlimitedAccess, t.noCredits]);

  const applyCreditFromResponse = useCallback((balance?: number) => {
    if (unlimitedAccess) return;
    if (typeof balance === 'number') {
      setCredits(balance);
    } else {
      syncCreditsFromServer().then(({ credits: c, unlimited }) => {
        setCredits(c);
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
        ...payload,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 402) {
        setCredits(typeof data.credits === 'number' ? data.credits : 0);
      }
      if (res.status === 422 && data.snapshotId) {
        throw new Error(
          lang === 'es'
            ? `${data.error}. Usa «Restaurar versión» en el historial.`
            : `${data.error}. Use «Restore version» in history.`
        );
      }
      throw new Error(data.error || 'Error en el Studio');
    }
    if (typeof data.credits === 'number') setCredits(data.credits);
    if (data.unlimited === true) setUnlimitedAccess(true);
    return data as { message: string; previewSections: PreviewSection[]; changedSectionIds?: number[]; credits?: number; unlimited?: boolean; templateSlug?: string; businessName?: string };
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
      }) as { message: string; previewSections: PreviewSection[]; changedSectionIds?: number[]; credits?: number; templateSlug?: string; businessName?: string; diffSummary?: string };

      setPreviewSections(data.previewSections);
      if (studioPhase === 'describe') setStudioPhase('active');
      if (data.templateSlug) setActiveTemplateSlug(data.templateSlug);
      if (data.businessName) setProjectName(data.businessName);
      applyCreditFromResponse(data.credits);

      const summary = currentInput.slice(0, 60) + (currentInput.length > 60 ? '…' : '');
      addChange(summary);
      const nextLog = [
        { id: Date.now(), summary, time: new Date().toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' }) },
        ...changeLog.slice(0, 9),
      ];
      setChangeLog(nextLog);

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
      toast.error(err instanceof Error ? err.message : 'Error al generar');
    } finally {
      setIsThinking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    if (studioPhase === 'onboarding') {
      toast.info(lang === 'es' ? 'Elige plantilla o «Describir mi web» en el panel.' : 'Pick a template or «Describe my website» in the panel.');
      return;
    }
    if (!checkCredits()) return;

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
    if (studioPhase === 'onboarding') {
      toast.info(lang === 'es' ? 'Elige plantilla o «Describir mi web» en el panel.' : 'Pick a template or «Describe my website» in the panel.');
      return;
    }
    if (!checkCredits()) return;
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

  const changeStyle = async (newStyle: 'elegante' | 'minimal' | 'moderno') => {
    if (studioPhase === 'onboarding') return;
    if (!checkCredits()) return;
    const impact = await previewImpact({ prompt: `estilo ${newStyle}`, action: 'style' });
    if (!(await confirmImpactIfNeeded(impact))) return;
    setStyle(newStyle);
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: `estilo ${newStyle}`, action: 'style', style: newStyle });
      setPreviewSections(data.previewSections);
      applyCreditFromResponse(data.credits);
      const summary = lang === 'es' ? `Estilo: ${newStyle}` : `Style: ${newStyle}`;
      addChange(summary);
      scheduleSave(data.previewSections, changeLog, projectName);
      loadSnapshots();
      flashSections(data.changedSectionIds ?? data.previewSections.map((s) => s.id));
      toast.success(lang === 'es' ? `Estilo: ${newStyle}` : `Style: ${newStyle}`, { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const regenerate = async () => {
    if (studioPhase === 'onboarding') return;
    if (!checkCredits()) return;
    const impact = await previewImpact({ prompt: 'regenerar', action: 'regenerate' });
    if (!(await confirmImpactIfNeeded(impact))) return;
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: 'regenerar', action: 'regenerate' });
      setPreviewSections(data.previewSections);
      applyCreditFromResponse(data.credits);
      const summary = lang === 'es' ? 'Regeneración completa' : 'Full regeneration';
      addChange(summary);
      scheduleSave(data.previewSections, changeLog, projectName);
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
    if (!checkCredits()) return;
    setSelectedSectionId(id);
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: 'mejorar sección', action: 'improve', sectionId: id });
      setPreviewSections(data.previewSections);
      applyCreditFromResponse(data.credits);
      const summary = lang === 'es' ? `Sección #${id} mejorada` : `Section #${id} improved`;
      addChange(summary);
      scheduleSave(data.previewSections, changeLog, projectName);
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
        body: JSON.stringify({ projectName, previewSections }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al exportar');
      const html = data.files?.['index.html'] || '';
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
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
          {activeTemplateSlug && (
            <Link
              href={`/templates/preview/${activeTemplateSlug}`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700"
            >
              <Eye className="w-3 h-3" />
              {t.templateLoaded}
            </Link>
          )}
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
        <div className="w-[min(340px,32vw)] flex flex-col border-r border-slate-200 bg-white shrink-0">
          <div className="p-7 border-b border-slate-100">
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

          <div className="flex-1 overflow-auto p-7 space-y-7 text-[15px] min-h-0">
            <AnimatePresence>
              {messages.map((msg) => (
                <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : ''}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user max-w-[83%]' : 'chat-bubble-ai max-w-[92%]'}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </AnimatePresence>
            {isThinking && (
              <div className="flex items-center gap-2 px-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span>{t.thinking}</span>
              </div>
            )}
          </div>

          <div className="px-7 py-4 border-t border-slate-100 shrink-0 bg-slate-50/80">
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
          </div>

          <div className="px-7 pt-4 pb-3 border-t border-slate-100 shrink-0">
            <div className="text-[10px] tracking-widest text-slate-400 mb-2">{lang === 'es' ? 'SUGERENCIAS' : 'SUGGESTIONS'}</div>
            <div className="flex flex-wrap gap-2">
              {t.quickPrompts.map((p, i) => (
                <button key={i} onClick={() => applyQuickPrompt(p)} disabled={isThinking} className="text-xs px-3 py-1.5 rounded-2xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-40 cursor-pointer">
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="p-7 border-t border-slate-100 bg-slate-50 shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t.placeholder}
                className="flex-1 bg-white border border-slate-200 focus:border-slate-400 px-5 py-4 text-sm rounded-3xl placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isThinking}
                className="w-[52px] h-[52px] bg-slate-900 rounded-3xl flex items-center justify-center text-white disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-400">
              <span>
                {unlimitedAccess
                  ? `${t.unlimitedAccess} · Superadmin`
                  : `${credits} ${t.creditsLeft} · ${t.creditHint}`}
              </span>
              <Link href="/guia" className="text-indigo-600 hover:underline">{lang === 'es' ? 'Ver guía' : 'View guide'}</Link>
            </div>
          </div>
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
                  {(['elegante', 'minimal', 'moderno'] as const).map((s, i) => (
                    <button key={s} onClick={() => changeStyle(s)} className={`px-4 py-1.5 rounded-[14px] transition cursor-pointer ${style === s ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>
                      {t.styles[i]}
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
              className={`mx-auto bg-white transition-all border border-slate-200 flex-1 w-full ${viewMode === 'mobile' ? 'max-w-[380px] rounded-[3.5rem]' : 'max-w-full rounded-[2.5rem]'} ${isThinking ? 'ring-2 ring-indigo-300 ring-offset-2' : ''}`}
            >
              {studioPhase === 'onboarding' ? (
                <StudioOnboarding lang={lang} onChooseDescribe={handleChooseDescribe} />
              ) : (
              <div className="p-6 md:p-10 space-y-8 bg-white">
                {previewSections.map((section) => (
                  <div
                    key={section.id}
                    ref={(el) => { sectionRefs.current[section.id] = el; }}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`group relative rounded-2xl transition-all duration-500 cursor-pointer ${
                      selectedSectionId === section.id ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
                    } ${highlightedIds.includes(section.id) ? 'ring-4 ring-emerald-400 ring-offset-4 scale-[1.01]' : ''}`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: section.html }} />
                    <button
                      onClick={(e) => { e.stopPropagation(); improveSection(section.id); }}
                      className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 cursor-pointer z-10"
                    >
                      <Zap className="w-3 h-3" /> {t.improve}
                    </button>
                  </div>
                ))}
              </div>
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
