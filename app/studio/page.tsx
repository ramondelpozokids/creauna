'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Send, Sparkles, RefreshCw, Download, Share2,
  Monitor, Smartphone, Zap, Coins, Lock, Rocket
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StudioAITeam from '../components/StudioAITeam';
import StudioCheckoutModal from '../components/StudioCheckoutModal';
import { getCredits, consumeCredit, isPaid, FREE_CREDITS } from '../lib/studioCredits';

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

const translations = {
  es: {
    title: 'CREAUNA Studio',
    subtitle: 'Diseño con IA',
    welcome: 'Hola. Soy tu director de diseño. Los 4 motores de IA trabajan en equipo para crear tu web. ¿Qué quieres diseñar hoy?',
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
    creditUsed: '1 crédito usado',
    paymentRequired: 'Completa el pago para exportar o publicar',
    creditsLeft: 'créditos',
  },
  en: {
    title: 'CREAUNA Studio',
    subtitle: 'AI Design',
    welcome: 'Hello. Your design director here. 4 AI engines work as a team to build your site. What shall we design today?',
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
    creditUsed: '1 credit used',
    paymentRequired: 'Complete payment to export or publish',
    creditsLeft: 'credits',
  },
};

const defaultHero = `<div class="bg-white border border-slate-200 px-16 py-20 rounded-[3.5rem]">
  <div class="max-w-2xl">
    <div class="text-xs tracking-[3px] text-slate-400">CREAUNA • 2026</div>
    <h1 class="text-[64px] font-semibold tracking-[-4.5px] leading-none mt-4 text-slate-900">Diseño que<br/>se siente premium.</h1>
    <p class="mt-5 text-xl text-slate-600">Webs elegantes creadas con inteligencia artificial.</p>
    <div class="mt-8 flex gap-3">
      <button class="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-medium">Ver colección</button>
      <button class="px-8 py-3 border border-slate-200 rounded-2xl text-sm">Ver demo</button>
    </div>
  </div>
</div>`;

export default function CreaunaStudio() {
  const [lang, setLang] = useState<Language>('es');
  const t = translations[lang];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [credits, setCredits] = useState(FREE_CREDITS);
  const [paid, setPaidState] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [previewSections, setPreviewSections] = useState<PreviewSection[]>([
    { id: 101, type: 'hero', html: defaultHero },
  ]);
  const [projectName, setProjectName] = useState('Mi nueva web');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [style, setStyle] = useState<'elegante' | 'minimal' | 'moderno'>('elegante');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCredits(getCredits());
    setPaidState(isPaid());
    setMessages([{ id: 1, role: 'ai', content: t.welcome }]);
  }, []);

  const useCreditOrBlock = useCallback((): boolean => {
    if (!consumeCredit()) {
      toast.error(t.noCredits);
      return false;
    }
    setCredits(getCredits());
    return true;
  }, [t.noCredits]);

  const requirePayment = useCallback((action: string) => {
    if (!paid) {
      toast.error(t.paymentRequired, {
        description: lang === 'es' ? 'Pulsa "Finalizar y pagar" para desbloquear.' : 'Click "Finalize & pay" to unlock.',
      });
      return true;
    }
    return false;
  }, [paid, t.paymentRequired, lang]);

  const processAIChange = async (currentInput: string) => {
    await new Promise((r) => setTimeout(r, 900));

    let aiText = lang === 'es'
      ? 'He refinado el diseño con más detalles de calidad.'
      : "I've refined the design with higher quality details.";

    let newSections = [...previewSections];
    const lower = currentInput.toLowerCase();

    if (lower.includes('elegante') || lower.includes('refinada') || lower.includes('premium') || lower.includes('elegant')) {
      aiText = lang === 'es' ? 'Motor Visual + UX: más espacio, tipografía refinada y detalles de lujo.' : 'Visual + UX engines: more space, refined typography and luxury details.';
      newSections = previewSections.map((sec) => ({
        ...sec,
        html: sec.html.replace(/bg-white/g, 'bg-slate-50').replace(/rounded-\[3\.5rem\]/g, 'rounded-[4rem]'),
      }));
    } else if (lower.includes('testimonio') || lower.includes('testimonial')) {
      aiText = lang === 'es' ? 'Motor de Redacción: sección de testimonios añadida.' : 'Copy engine: testimonial section added.';
      newSections = [
        ...previewSections,
        {
          id: Date.now(),
          type: 'testimonial',
          html: `<div class="bg-white border border-slate-200 px-12 py-14 rounded-[3.5rem]">
          <div class="max-w-lg">
            <div class="text-3xl leading-snug italic text-slate-800">"La web más bonita que he creado. Todo el mundo me pregunta quién la hizo."</div>
            <div class="mt-8 flex items-center gap-4">
              <div class="w-9 h-9 rounded-full bg-slate-200"></div>
              <div><div class="font-medium">Laura Mendoza</div><div class="text-xs text-slate-500">Fundadora, Atelier</div></div>
            </div>
          </div>
        </div>`,
        },
      ];
    } else if (lower.includes('hero') || lower.includes('impactante') || lower.includes('cinematic')) {
      aiText = lang === 'es' ? 'Motor Visual: hero más impactante y emotivo.' : 'Visual engine: more impactful hero.';
      newSections = previewSections.map((sec) =>
        sec.type === 'hero'
          ? {
              ...sec,
              html: `<div class="bg-white border border-slate-200 px-16 py-24 rounded-[4rem]">
          <div class="max-w-2xl">
            <div class="text-xs tracking-[3px] text-slate-400">EDICIÓN 2026</div>
            <h1 class="text-[70px] font-semibold tracking-[-5px] leading-none mt-3 text-slate-900">Creado con<br/>cuidado.</h1>
            <p class="mt-5 text-2xl text-slate-600">La nueva forma de hacer webs excepcionales.</p>
          </div>
        </div>`,
            }
          : sec
      );
    } else if (lower.includes('clara') || lower.includes('luminosa') || lower.includes('bright')) {
      aiText = lang === 'es' ? 'Motor de Experiencia: versión más clara y luminosa.' : 'UX engine: brighter, lighter version.';
      newSections = previewSections.map((sec) => ({
        ...sec,
        html: sec.html.replace(/bg-slate-50|bg-white/g, 'bg-white'),
      }));
    } else {
      aiText = lang === 'es'
        ? 'Motores IA sincronizados: cambio aplicado al instante.'
        : 'AI engines synced: change applied instantly.';
    }

    setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', content: aiText }]);
    setPreviewSections(newSections);
    setIsThinking(false);
    toast.success(t.successUpdate, { description: t.creditUsed });
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    if (!useCreditOrBlock()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsThinking(true);
    await processAIChange(currentInput);
  };

  const applyQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      if (!useCreditOrBlock()) return;
      setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: prompt }]);
      setInput('');
      setIsThinking(true);
      processAIChange(prompt);
    }, 30);
  };

  const changeStyle = (newStyle: 'elegante' | 'minimal' | 'moderno') => {
    if (!useCreditOrBlock()) return;
    setStyle(newStyle);
    let replacement = 'bg-white';
    if (newStyle === 'elegante') replacement = 'bg-slate-50';
    if (newStyle === 'minimal') replacement = 'bg-white border border-slate-200';
    if (newStyle === 'moderno') replacement = 'bg-slate-100';
    setPreviewSections((prev) =>
      prev.map((section) => ({
        ...section,
        html: section.html.replace(/bg-white|bg-slate-50|bg-slate-100/g, replacement),
      }))
    );
    toast.success(lang === 'es' ? `Estilo: ${newStyle} (1 crédito)` : `Style: ${newStyle} (1 credit)`);
  };

  const regenerate = () => {
    if (!useCreditOrBlock()) return;
    setIsThinking(true);
    setTimeout(() => {
      setPreviewSections((prev) =>
        prev.map((s, i) => ({
          ...s,
          html: s.html.replace(/rounded-\[3\.5rem\]/g, i % 2 === 0 ? 'rounded-[4.5rem]' : 'rounded-[3.5rem]'),
        }))
      );
      setIsThinking(false);
      toast.success(lang === 'es' ? 'Nuevas variaciones (1 crédito)' : 'New variations (1 credit)');
    }, 900);
  };

  const improveSection = (id: number) => {
    if (!useCreditOrBlock()) return;
    setIsThinking(true);
    setTimeout(() => {
      setPreviewSections((prev) =>
        prev.map((section) =>
          section.id === id
            ? { ...section, html: section.html + `<div class="mt-4 text-xs text-slate-400 tracking-widest">— REFINADO POR MOTORES IA</div>` }
            : section
        )
      );
      setIsThinking(false);
      toast.success(lang === 'es' ? 'Sección mejorada (1 crédito)' : 'Section improved (1 credit)');
    }, 700);
  };

  const handleExport = () => {
    if (requirePayment('export')) {
      setCheckoutOpen(true);
      return;
    }
    toast.success(lang === 'es' ? 'Exportado como código limpio' : 'Exported as clean code');
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
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
            <Coins className="w-3.5 h-3.5" />
            {credits} {t.creditsLeft}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center border border-slate-200 rounded-2xl bg-white mr-1">
            <button onClick={() => setLang('es')} className={`px-3 py-1 rounded-2xl text-xs ${lang === 'es' ? 'bg-slate-900 text-white' : ''}`}>ES</button>
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-2xl text-xs ${lang === 'en' ? 'bg-slate-900 text-white' : ''}`}>EN</button>
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
        <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white shrink-0">
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

          <div className="px-7 pt-4 pb-3 border-t border-slate-100 shrink-0">
            <div className="text-[10px] tracking-widest text-slate-400 mb-2">{lang === 'es' ? 'SUGERENCIAS' : 'SUGGESTIONS'}</div>
            <div className="flex flex-wrap gap-2">
              {t.quickPrompts.slice(0, 4).map((p, i) => (
                <button key={i} onClick={() => applyQuickPrompt(p)} className="text-xs px-3 py-1.5 rounded-2xl border border-slate-200 hover:bg-slate-100 cursor-pointer">
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
              <span>{credits} {t.creditsLeft}</span>
              <Link href="/guia" className="text-indigo-600 hover:underline">{lang === 'es' ? 'Ver guía' : 'View guide'}</Link>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-100 p-8 overflow-auto min-w-0">
          <div className="max-w-[1120px] mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 px-1">
              <div className="flex items-center gap-4">
                <div className="font-medium tracking-tight text-xl">{projectName}</div>
                <div className={`text-xs px-3 py-px rounded-full border font-semibold ${paid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  {paid ? t.ready : t.draft}
                </div>
              </div>
              <div className="flex items-center gap-3">
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

            <div className={`mx-auto bg-white transition-all shadow-xl border border-slate-200 ${viewMode === 'mobile' ? 'max-w-[380px] rounded-[3.5rem]' : 'max-w-[1120px] rounded-[4rem]'}`}>
              <div className="h-9 bg-slate-100 border-b flex items-center px-5 text-xs text-slate-500">
                <div className="flex-1 text-center font-mono tracking-[2px] text-[10px]">{projectName.toLowerCase().replace(/\s/g, '')}.creauna.com</div>
              </div>
              <div className="p-10 space-y-8 bg-white">
                {previewSections.map((section) => (
                  <div key={section.id} className="group relative">
                    <div dangerouslySetInnerHTML={{ __html: section.html }} />
                    <button
                      onClick={() => improveSection(section.id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition bg-white text-slate-900 text-xs px-3 py-1 rounded-full border shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3" /> {t.improve}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-5 tracking-widest">
              {t.livePreview} • {lang === 'es' ? 'CADA CAMBIO ES INSTANTÁNEO' : 'EVERY CHANGE IS INSTANT'}
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
