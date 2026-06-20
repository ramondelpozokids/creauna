import { chatCompletion } from './providers';

export interface PreviewSection {
  id: number;
  type: string;
  html: string;
}

export type StudioAction = 'change' | 'regenerate' | 'improve' | 'style';

export interface StudioGenerateInput {
  prompt: string;
  lang: 'es' | 'en';
  previewSections: PreviewSection[];
  style?: 'elegante' | 'minimal' | 'moderno';
  action?: StudioAction;
  sectionId?: number;
}

export interface StudioGenerateResult {
  message: string;
  previewSections: PreviewSection[];
  motorsUsed: string[];
  source: 'rules' | 'ai';
}

function applyRuleBasedChange(input: StudioGenerateInput): StudioGenerateResult {
  const { prompt, lang, previewSections, action, sectionId, style } = input;
  const lower = prompt.toLowerCase();
  let message = lang === 'es'
    ? 'Motores IA sincronizados: cambio aplicado al instante.'
    : 'AI engines synced: change applied instantly.';
  let sections = [...previewSections];
  const motors: string[] = ['visual', 'copy', 'code', 'ux'];

  if (action === 'regenerate') {
    sections = previewSections.map((s, i) => ({
      ...s,
      html: s.html.replace(/rounded-\[3\.5rem\]/g, i % 2 === 0 ? 'rounded-[4.5rem]' : 'rounded-[3.5rem]'),
    }));
    message = lang === 'es' ? 'Motor Visual: nuevas variaciones generadas.' : 'Visual engine: new variations generated.';
    return { message, previewSections: sections, motorsUsed: ['visual'], source: 'rules' };
  }

  if (action === 'improve' && sectionId) {
    sections = previewSections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            html: `${section.html}<div class="mt-4 text-xs text-slate-400 tracking-widest">— REFINADO POR MOTORES IA</div>`,
          }
        : section
    );
    message = lang === 'es' ? 'Motores IA: sección refinada.' : 'AI engines: section refined.';
    return { message, previewSections: sections, motorsUsed: ['visual', 'ux'], source: 'rules' };
  }

  if (action === 'style' && style) {
    let replacement = 'bg-white';
    if (style === 'elegante') replacement = 'bg-slate-50';
    if (style === 'minimal') replacement = 'bg-white border border-slate-200';
    if (style === 'moderno') replacement = 'bg-slate-100';
    sections = previewSections.map((section) => ({
      ...section,
      html: section.html.replace(/bg-white|bg-slate-50|bg-slate-100/g, replacement),
    }));
    message = lang === 'es' ? `Motor de Experiencia: estilo ${style} aplicado.` : `UX engine: ${style} style applied.`;
    return { message, previewSections: sections, motorsUsed: ['ux'], source: 'rules' };
  }

  if (lower.includes('elegante') || lower.includes('refinada') || lower.includes('premium') || lower.includes('elegant')) {
    message = lang === 'es'
      ? 'Motor Visual + UX: más espacio, tipografía refinada y detalles de lujo.'
      : 'Visual + UX engines: more space, refined typography and luxury details.';
    sections = previewSections.map((sec) => ({
      ...sec,
      html: sec.html.replace(/bg-white/g, 'bg-slate-50').replace(/rounded-\[3\.5rem\]/g, 'rounded-[4rem]'),
    }));
    return { message, previewSections: sections, motorsUsed: ['visual', 'ux'], source: 'rules' };
  }

  if (lower.includes('testimonio') || lower.includes('testimonial')) {
    message = lang === 'es' ? 'Motor de Redacción: sección de testimonios añadida.' : 'Copy engine: testimonial section added.';
    sections = [
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
    return { message, previewSections: sections, motorsUsed: ['copy'], source: 'rules' };
  }

  if (lower.includes('hero') || lower.includes('impactante') || lower.includes('cinematic')) {
    message = lang === 'es' ? 'Motor Visual: hero más impactante y emotivo.' : 'Visual engine: more impactful hero.';
    sections = previewSections.map((sec) =>
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
    return { message, previewSections: sections, motorsUsed: ['visual'], source: 'rules' };
  }

  if (lower.includes('clara') || lower.includes('luminosa') || lower.includes('bright')) {
    message = lang === 'es' ? 'Motor de Experiencia: versión más clara y luminosa.' : 'UX engine: brighter, lighter version.';
    sections = previewSections.map((sec) => ({
      ...sec,
      html: sec.html.replace(/bg-slate-50|bg-white/g, 'bg-white'),
    }));
    return { message, previewSections: sections, motorsUsed: ['ux'], source: 'rules' };
  }

  return { message, previewSections: sections, motorsUsed: motors, source: 'rules' };
}

export async function generateStudioChange(input: StudioGenerateInput): Promise<StudioGenerateResult> {
  const ruleResult = applyRuleBasedChange(input);

  const aiResult = await chatCompletion([
    {
      role: 'system',
      content: `Eres el director de diseño de CREAUNA. Los 4 motores (Visual, Redacción, Código, UX) trabajan en equipo.
Responde SOLO en JSON válido con esta forma:
{"message":"texto breve para el usuario","motorsUsed":["visual","copy","code","ux"]}
Idioma: ${input.lang === 'es' ? 'español' : 'inglés'}. No reveles nombres de IAs externas.`,
    },
    {
      role: 'user',
      content: `Petición del cliente: "${input.prompt}"
Acción: ${input.action || 'change'}
Secciones actuales: ${input.previewSections.map((s) => s.type).join(', ')}`,
    },
  ], { temperature: 0.5, maxTokens: 300, prompt: input.prompt });

  if (!aiResult.content) return ruleResult;

  try {
    const jsonMatch = aiResult.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return ruleResult;
    const parsed = JSON.parse(jsonMatch[0]) as { message?: string; motorsUsed?: string[] };
    if (!parsed.message) return ruleResult;
    return {
      message: parsed.message,
      previewSections: ruleResult.previewSections,
      motorsUsed: Array.isArray(parsed.motorsUsed) ? parsed.motorsUsed : ruleResult.motorsUsed,
      source: 'ai',
    };
  } catch {
    return ruleResult;
  }
}
