'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, RotateCcw, Sparkles, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type ScenarioId = 'restArt' | 'kebab' | 'royalBang' | 'campon';

type ChatLine = { role: 'ai' | 'user'; text: string };
type PreviewMode = 'none' | 'draft' | 'full';

const copy = {
  es: {
    badge: 'DEMO EN VIVO',
    title: 'Así funciona CREAUNA',
    subtitle:
      'Elige un caso real, pulsa reproducir y muestra a tu cliente el flujo completo: idea → web → refinamiento. Sin registro y sin consumir créditos.',
    play: 'Reproducir demo',
    replay: 'Repetir',
    tryStudio: 'Probar en el Studio',
    howItWorks: 'Ver proceso completo',
    chatTitle: 'Conversación',
    previewTitle: 'Vista previa',
    thinking: 'Los motores IA trabajan…',
    openFull: 'Abrir web completa',
    scenarios: {
      restArt: {
        label: 'Rest Art Café',
        prompt:
          'Rest Art Café en Vallecas: restaurante con terraza, menú del día, reservas y reseñas de Google. Estilo cálido y premium.',
        ai1: 'Perfecto. Primera versión con hero de terraza, datos de contacto y menú del día para Rest Art Café.',
        refine: 'Añade galería de fotos, reseñas verificadas y bloque de servicios más completo.',
        ai2: 'Listo. Web completa con galería, reseñas y toda la información del restaurante.',
      },
      kebab: {
        label: 'Kebab Hut',
        prompt:
          'Kebab Hut en Vallecas: döner auténtico, carta con fotos reales y ambiente urbano premium. Solo servicio en local.',
        ai1: 'Entendido. Monto la web con hero gastronómico, carta destacada y llamada a la acción.',
        refine: 'Más impacto visual en el hero y galería de platos más apetitosa.',
        ai2: 'Aplicado: hero más potente, carta visual y galería con fotos reales del local.',
      },
      royalBang: {
        label: 'Royal Bang',
        prompt:
          'Royal Bang Tattoo & Piercing en Puente de Vallecas: estudio profesional, portfolio visual y reserva de citas. Estilo oscuro y urbano.',
        ai1: 'Genial. Primera versión con identidad fuerte, hero impactante y propuesta de valor clara.',
        refine: 'Más galería de trabajos, sección de artistas y mejor jerarquía visual.',
        ai2: 'Hecho. Portfolio ampliado, artistas destacados y diseño más editorial.',
      },
      campon: {
        label: 'Campón Asesores',
        prompt:
          'Campón Asesores en Vallecas: asesoría fiscal, laboral y contable desde 1991. Transmitir confianza y profesionalidad.',
        ai1: 'Perfecto. Preparo la primera versión con hero institucional, servicios y contacto para Campón Asesores.',
        refine: 'Añade sección de equipo, tarifas claras y bloque de servicios más detallado.',
        ai2: 'Listo. Web completa con servicios, equipo, tarifas y formulario de contacto.',
      },
    },
  },
  en: {
    badge: 'LIVE DEMO',
    title: 'How CREAUNA works',
    subtitle:
      'Pick a real case, hit play, and walk your client through the full flow: idea → website → refinement. No signup, no credits used.',
    play: 'Play demo',
    replay: 'Replay',
    tryStudio: 'Try in Studio',
    howItWorks: 'See full process',
    chatTitle: 'Conversation',
    previewTitle: 'Live preview',
    thinking: 'AI engines at work…',
    openFull: 'Open full site',
    scenarios: {
      restArt: {
        label: 'Rest Art Café',
        prompt:
          'Rest Art Café in Vallecas: terrace restaurant, daily menu, reservations and Google reviews. Warm, premium feel.',
        ai1: 'Perfect. First version with terrace hero, contact info and daily menu for Rest Art Café.',
        refine: 'Add photo gallery, verified reviews and a fuller services block.',
        ai2: 'Done. Full site with gallery, reviews and all restaurant information.',
      },
      kebab: {
        label: 'Kebab Hut',
        prompt:
          'Kebab Hut in Vallecas: authentic döner, menu with real photos and premium urban vibe. Dine-in only.',
        ai1: 'Got it. Building hero, featured menu and clear call to action.',
        refine: 'Stronger hero impact and a more appetizing dish gallery.',
        ai2: 'Applied: bolder hero, visual menu and gallery with real venue photos.',
      },
      royalBang: {
        label: 'Royal Bang',
        prompt:
          'Royal Bang Tattoo & Piercing in Vallecas: professional studio, visual portfolio and booking. Dark, urban style.',
        ai1: 'Great. First version with strong identity, bold hero and clear value proposition.',
        refine: 'More work gallery, artists section and better visual hierarchy.',
        ai2: 'Done. Expanded portfolio, featured artists and more editorial layout.',
      },
      campon: {
        label: 'Campón Asesores',
        prompt:
          'Campón Asesores in Vallecas: tax, payroll and accounting advisory since 1991. Trust and professionalism.',
        ai1: 'Perfect. Building institutional hero, services and contact for Campón Asesores.',
        refine: 'Add team section, clear pricing and a more detailed services block.',
        ai2: 'Done. Full site with services, team, pricing and contact form.',
      },
    },
  },
} as const;

const scenarioConfig: Record<
  ScenarioId,
  { demoPath: string; siteUrl: string; studioSlug: string; studioPrompt: string }
> = {
  restArt: {
    demoPath: '/demos/clientes/rest-art-cafe/index.html',
    siteUrl: 'restartcafe.com',
    studioSlug: 'mokka',
    studioPrompt: 'Rest Art Cafe restaurante terraza Vallecas',
  },
  kebab: {
    demoPath: '/demos/clientes/kebab-hut/index.html',
    siteUrl: 'kebabhutvallecas.es',
    studioSlug: 'street',
    studioPrompt: 'Kebab Hut Vallecas döner auténtico',
  },
  royalBang: {
    demoPath: '/demos/clientes/royal-bang/index.html',
    siteUrl: 'royalbangtattoo.es',
    studioSlug: 'iron-ink',
    studioPrompt: 'Royal Bang Tattoo Piercing Vallecas',
  },
  campon: {
    demoPath: '/demos/clientes/campon-asesores/index.html',
    siteUrl: 'camponasesores.es',
    studioSlug: 'ledger',
    studioPrompt: 'Campón Asesores gestoría Vallecas Madrid',
  },
};

export default function ClientProductDemo() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [scenario, setScenario] = useState<ScenarioId>('restArt');
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('none');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cfg = scenarioConfig[scenario];
  const sc = t.scenarios[scenario];

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setDone(false);
    setThinking(false);
    setMessages([]);
    setPreviewMode('none');
  }, [clearTimers]);

  useEffect(() => {
    reset();
  }, [scenario, lang, reset]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const runDemo = () => {
    reset();
    setPlaying(true);

    schedule(() => {
      setMessages([
        {
          role: 'ai',
          text:
            lang === 'es'
              ? 'Cuéntame tu negocio y creo la primera versión.'
              : 'Tell me about your business and I will build the first version.',
        },
      ]);
    }, 400);

    schedule(() => {
      setMessages((m) => [...m, { role: 'user', text: sc.prompt }]);
    }, 1400);

    schedule(() => setThinking(true), 2400);

    schedule(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: 'ai', text: sc.ai1 }]);
      setPreviewMode('draft');
    }, 4200);

    schedule(() => {
      setMessages((m) => [...m, { role: 'user', text: sc.refine }]);
    }, 5800);

    schedule(() => setThinking(true), 6600);

    schedule(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: 'ai', text: sc.ai2 }]);
      setPreviewMode('full');
      setDone(true);
      setPlaying(false);
    }, 8200);
  };

  const studioHref = `/studio?template=${cfg.studioSlug}&lang=${lang}&prompt=${encodeURIComponent(cfg.studioPrompt)}`;
  const previewHeight = previewMode === 'draft' ? 300 : previewMode === 'full' ? 520 : 0;

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          {t.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">{t.title}</h1>
        <p className="mt-4 text-slate-600 text-base leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(t.scenarios) as ScenarioId[]).map((id) => (
          <button
            key={id}
            type="button"
            disabled={playing}
            onClick={() => setScenario(id)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border transition cursor-pointer disabled:opacity-50 ${
              scenario === id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            {t.scenarios[id].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={runDemo}
          disabled={playing}
          className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
        >
          {playing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {t.play}
        </button>
        {(done || messages.length > 0) && (
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {t.replay}
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[420px]">
          <div className="px-5 py-3 border-b border-slate-100 text-xs font-bold tracking-widest text-slate-500 uppercase">
            {t.chatTitle}
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[480px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                {t.thinking}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[420px]">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase shrink-0">
              {t.previewTitle}
            </span>
            <span className="text-[10px] font-mono text-slate-400 truncate">{cfg.siteUrl}</span>
          </div>
          <div className="flex-1 bg-slate-50 p-3 overflow-hidden">
            {previewMode !== 'none' ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-700">
                <div
                  className="overflow-hidden transition-all duration-700"
                  style={{ height: previewHeight }}
                >
                  <iframe
                    key={`${scenario}-${previewMode}`}
                    src={cfg.demoPath}
                    title={sc.label}
                    className="w-full border-0"
                    style={{
                      height: previewMode === 'full' ? 520 : 300,
                      pointerEvents: previewMode === 'full' ? 'auto' : 'none',
                    }}
                    loading="lazy"
                  />
                </div>
                {previewMode === 'full' && (
                  <a
                    href={cfg.demoPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 transition-colors"
                  >
                    {t.openFull}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[320px] flex items-center justify-center text-sm text-slate-400 text-center px-6">
                {lang === 'es'
                  ? 'Pulsa «Reproducir demo» para ver la web generarse.'
                  : 'Press «Play demo» to watch the site build.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {done && (
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link
            href={studioHref}
            className="btn-gradient px-10 py-4 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md"
          >
            {t.tryStudio}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/como-funciona"
            className="px-10 py-4 rounded-2xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center gap-2"
          >
            {t.howItWorks}
          </Link>
        </div>
      )}
    </div>
  );
}
