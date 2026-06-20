'use client';

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, Sparkles, RefreshCw, Download, Share2,
  Monitor, Smartphone, Zap, Coins, Lock, Rocket, History, Eye
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StudioAITeam from '../components/StudioAITeam';
import StudioCheckoutModal from '../components/StudioCheckoutModal';
import { useLanguage } from '../components/LanguageProvider';
import { getCredits, consumeCredit, isPaid, FREE_CREDITS } from '../lib/studioCredits';
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

const translations = {
  es: {
    title: 'CREAUNA Studio',
    subtitle: 'Diseño con IA',
    welcome: 'Hola. Soy tu director de diseño. Los 4 motores de IA trabajan en equipo para crear tu web. ¿Qué quieres diseñar hoy?',
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
    changes: 'Historial de cambios',
    noChanges: 'Los cambios aparecerán aquí al editar',
    viewCollection: 'Ver colección',
    viewDemo: 'Ver demo',
    templateLoaded: 'Plantilla activa',
    instant: 'CADA CAMBIO ES INSTANTÁNEO',
    selectSection: 'Selecciona una sección para editarla',
    sections: { hero: 'Inicio', services: 'Servicios', gallery: 'Galería', contact: 'Contacto', testimonial: 'Testimonios' },
    changeApplied: 'Cambio visible aplicado',
  },
  en: {
    title: 'CREAUNA Studio',
    subtitle: 'AI Design',
    welcome: 'Hello. Your design director here. 4 AI engines work as a team to build your site. What shall we design today?',
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
    changes: 'Change history',
    noChanges: 'Changes will appear here as you edit',
    viewCollection: 'View collection',
    viewDemo: 'View demo',
    templateLoaded: 'Active template',
    instant: 'EVERY CHANGE IS INSTANT',
    selectSection: 'Select a section to edit it',
    sections: { hero: 'Home', services: 'Services', gallery: 'Gallery', contact: 'Contact', testimonial: 'Testimonials' },
    changeApplied: 'Visible change applied',
  },
};

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
  const [paid, setPaidState] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [previewSections, setPreviewSections] = useState<PreviewSection[]>([
    { id: 101, type: 'hero', html: buildDefaultHero('es') },
  ]);
  const [projectName, setProjectName] = useState('Mi nueva web');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [style, setStyle] = useState<'elegante' | 'minimal' | 'moderno'>('elegante');
  const [mounted, setMounted] = useState(false);
  const [activeTemplateSlug, setActiveTemplateSlug] = useState<string | undefined>();
  const [changeLog, setChangeLog] = useState<ChangeEntry[]>([]);
  const [previewPulse, setPreviewPulse] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const templateLoadedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setCredits(getCredits());
    setPaidState(isPaid());
  }, []);

  useEffect(() => {
    if (!mounted || templateLoadedRef.current) return;
    if (templateParam) {
      const tpl = getTemplateBySlug(templateParam);
      if (tpl) {
        templateLoadedRef.current = true;
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
    setMessages([{ id: 1, role: 'ai', content: t.welcome }]);
    setPreviewSections([{ id: 101, type: 'hero', html: buildDefaultHero(lang, activeTemplateSlug) }]);
  }, [mounted, templateParam, lang, t.welcome, t.welcomeTemplate, activeTemplateSlug]);

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
    if (getCredits() <= 0) {
      toast.error(t.noCredits);
      return false;
    }
    return true;
  }, [t.noCredits]);

  const applyCreditOnSuccess = useCallback(() => {
    consumeCredit();
    setCredits(getCredits());
  }, []);

  const requirePayment = useCallback(() => {
    if (!paid) {
      toast.error(t.paymentRequired, {
        description: lang === 'es' ? 'Pulsa "Finalizar y pagar" para desbloquear.' : 'Click "Finalize & pay" to unlock.',
      });
      return true;
    }
    return false;
  }, [paid, t.paymentRequired, lang]);

  const callStudioApi = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/studio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang,
        previewSections,
        ...payload,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en el Studio');
    return data as { message: string; previewSections: PreviewSection[]; changedSectionIds?: number[] };
  };

  const flashSections = (ids: number[]) => {
    if (ids.length === 0) return;
    setHighlightedIds(ids);
    setTimeout(() => setHighlightedIds([]), 2500);
    const first = sectionRefs.current[ids[0]];
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const processAIChange = async (currentInput: string, action: 'change' | 'regenerate' | 'improve' = 'change', sectionId?: number) => {
    try {
      const data = await callStudioApi({
        prompt: currentInput,
        action,
        sectionId: sectionId ?? selectedSectionId ?? undefined,
      });
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', content: data.message }]);
      setPreviewSections(data.previewSections);
      applyCreditOnSuccess();
      addChange(currentInput.slice(0, 60) + (currentInput.length > 60 ? '…' : ''));
      flashSections(data.changedSectionIds ?? []);
      toast.success(t.changeApplied, { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar');
    } finally {
      setIsThinking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    if (!checkCredits()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsThinking(true);
    await processAIChange(currentInput);
  };

  const applyQuickPrompt = (prompt: string) => {
    if (!checkCredits()) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: prompt }]);
    setInput('');
    setIsThinking(true);
    processAIChange(prompt);
  };

  const changeStyle = async (newStyle: 'elegante' | 'minimal' | 'moderno') => {
    if (!checkCredits()) return;
    setStyle(newStyle);
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: `estilo ${newStyle}`, action: 'style', style: newStyle });
      setPreviewSections(data.previewSections);
      applyCreditOnSuccess();
      addChange(lang === 'es' ? `Estilo: ${newStyle}` : `Style: ${newStyle}`);
      flashSections(data.changedSectionIds ?? data.previewSections.map((s) => s.id));
      toast.success(lang === 'es' ? `Estilo: ${newStyle}` : `Style: ${newStyle}`, { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const regenerate = async () => {
    if (!checkCredits()) return;
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: 'regenerar', action: 'regenerate' });
      setPreviewSections(data.previewSections);
      applyCreditOnSuccess();
      addChange(lang === 'es' ? 'Regeneración completa' : 'Full regeneration');
      flashSections(data.changedSectionIds ?? data.previewSections.map((s) => s.id));
      toast.success(lang === 'es' ? 'Nuevas variaciones' : 'New variations', { description: t.creditUsed });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsThinking(false);
    }
  };

  const improveSection = async (id: number) => {
    if (!checkCredits()) return;
    setSelectedSectionId(id);
    setIsThinking(true);
    try {
      const data = await callStudioApi({ prompt: 'mejorar sección', action: 'improve', sectionId: id });
      setPreviewSections(data.previewSections);
      applyCreditOnSuccess();
      addChange(lang === 'es' ? `Sección #${id} mejorada` : `Section #${id} improved`);
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
    if (requirePayment()) {
      setCheckoutOpen(true);
      return;
    }
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
            {credits} {t.creditsLeft}
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
            {!paid && <Lock className="w-3 h-3 text-slate-400" />}
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

          <StudioAITeam isActive={isThinking} lang={lang} />

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
              <span>{credits} {t.creditsLeft} · {t.creditHint}</span>
              <Link href="/guia" className="text-indigo-600 hover:underline">{lang === 'es' ? 'Ver guía' : 'View guide'}</Link>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-100 p-4 md:p-6 overflow-auto min-w-0 flex flex-col">
          <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3 px-1 shrink-0">
              <div className="flex items-center gap-4">
                <div className="font-medium tracking-tight text-xl">{projectName}</div>
                <div className={`text-xs px-3 py-px rounded-full border font-semibold ${paid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  {paid ? t.ready : t.draft}
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
        onPaymentComplete={() => setPaidState(true)}
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
