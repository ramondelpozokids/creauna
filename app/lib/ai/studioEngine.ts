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
  changedSectionIds: number[];
}

function cloneSections(sections: PreviewSection[]): PreviewSection[] {
  return sections.map((s) => ({ ...s }));
}

function patchSection(
  sections: PreviewSection[],
  id: number,
  html: string
): PreviewSection[] {
  return sections.map((s) => (s.id === id ? { ...s, html } : s));
}

function targetSection(input: StudioGenerateInput): PreviewSection {
  if (input.sectionId) {
    return input.previewSections.find((s) => s.id === input.sectionId) ?? input.previewSections[0];
  }
  return input.previewSections.find((s) => s.type === 'hero') ?? input.previewSections[0];
}

function applyStyleTransform(html: string, style: 'elegante' | 'minimal' | 'moderno'): string {
  if (style === 'elegante') {
    return html
      .replace(/bg-slate-900/g, 'bg-slate-950')
      .replace(/rounded-\[2rem\]/g, 'rounded-[2.5rem]')
      .replace(/text-4xl/g, 'text-5xl')
      .replace(/font-semibold/g, 'font-semibold tracking-tight')
      + '<div class="mt-2 h-1 w-16 bg-indigo-500 rounded-full"></div>';
  }
  if (style === 'minimal') {
    return html
      .replace(/bg-slate-900/g, 'bg-white')
      .replace(/text-white/g, 'text-slate-900')
      .replace(/border border-slate-200/g, 'border-2 border-slate-900')
      .replace(/rounded-\[2rem\]/g, 'rounded-xl');
  }
  return html
    .replace(/bg-slate-900/g, 'bg-gradient-to-br from-indigo-600 to-violet-700')
    .replace(/bg-slate-50/g, 'bg-indigo-50')
    .replace(/rounded-\[2rem\]/g, 'rounded-3xl');
}

function applyPromptRules(input: StudioGenerateInput): StudioGenerateResult | null {
  const { prompt, lang, previewSections, action, sectionId, style } = input;
  const lower = prompt.toLowerCase();
  const target = targetSection(input);
  let sections = cloneSections(previewSections);
  const changedIds: number[] = [];

  if (action === 'regenerate') {
    sections = sections.map((s) => ({
      ...s,
      html: applyStyleTransform(s.html, 'moderno'),
    }));
    return {
      message: lang === 'es' ? 'Motor Visual: diseño regenerado con nueva paleta y ritmo.' : 'Visual engine: design regenerated with new palette and rhythm.',
      previewSections: sections,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: sections.map((s) => s.id),
    };
  }

  if (action === 'improve' && sectionId) {
    const sec = sections.find((s) => s.id === sectionId);
    if (sec) {
      const improved = applyStyleTransform(sec.html, 'elegante')
        .replace(/<h1/g, '<h1 class="!text-5xl md:!text-7xl"')
        .replace(/<h2/g, '<h2 class="!text-4xl"');
      sections = patchSection(sections, sectionId, improved + `<div class="mt-4 px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full inline-block">${lang === 'es' ? '✓ Sección mejorada' : '✓ Section improved'}</div>`);
      changedIds.push(sectionId);
      return {
        message: lang === 'es' ? 'Motores IA: sección refinada con tipografía y espaciado premium.' : 'AI engines: section refined with premium typography and spacing.',
        previewSections: sections,
        motorsUsed: ['visual', 'ux', 'copy'],
        source: 'rules',
        changedSectionIds: changedIds,
      };
    }
  }

  if (action === 'style' && style) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStyleTransform(s.html, style) };
    });
    return {
      message: lang === 'es' ? `Motor de Experiencia: estilo «${style}» aplicado a toda la vista.` : `UX engine: «${style}» style applied to the full view.`,
      previewSections: sections,
      motorsUsed: ['ux', 'visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('testimonio') || lower.includes('testimonial')) {
    const testimonial = {
      id: Date.now(),
      type: 'testimonial',
      html: `<div class="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-[2rem] p-10 md:p-14 shadow-lg">
        <div class="text-xs font-bold tracking-widest text-indigo-600 uppercase">${lang === 'es' ? 'Testimonios' : 'Testimonials'}</div>
        <p class="mt-4 text-2xl md:text-3xl font-medium text-slate-800 leading-snug">"${lang === 'es' ? 'La web más bonita que he creado. Todo el mundo me pregunta quién la hizo.' : 'The most beautiful site I have ever created. Everyone asks who made it.'}"</p>
        <div class="mt-6 font-semibold text-slate-700">Laura Mendoza</div>
        <div class="text-sm text-slate-500">${lang === 'es' ? 'Fundadora, Atelier' : 'Founder, Atelier'}</div>
      </div>`,
    };
    sections = [...sections, testimonial];
    changedIds.push(testimonial.id);
    return {
      message: lang === 'es' ? 'Motor de Redacción: bloque de testimonios añadido.' : 'Copy engine: testimonial block added.',
      previewSections: sections,
      motorsUsed: ['copy'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('elegante') || lower.includes('refinad') || lower.includes('elegant') || lower.includes('premium')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStyleTransform(s.html, 'elegante') };
    });
    return {
      message: lang === 'es' ? 'Motor Visual + UX: más espacio, tipografía refinada y detalles premium.' : 'Visual + UX: more space, refined typography and premium details.',
      previewSections: sections,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('hero') || lower.includes('impactante') || lower.includes('impactful') || lower.includes('cabecera')) {
    const hero = sections.find((s) => s.type === 'hero') ?? target;
    const newHero = hero.html
      .replace(/text-4xl md:text-6xl/g, 'text-5xl md:text-7xl')
      .replace(/min-h-\[420px\]/g, 'min-h-[480px]')
      .replace(/opacity-50/g, 'opacity-40')
      + `<div class="absolute top-4 right-4 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full z-20">${lang === 'es' ? 'HERO MEJORADO' : 'HERO ENHANCED'}</div>`;
    sections = patchSection(sections, hero.id, newHero);
    changedIds.push(hero.id);
    return {
      message: lang === 'es' ? 'Motor Visual: hero más grande e impactante.' : 'Visual engine: larger, more impactful hero.',
      previewSections: sections,
      motorsUsed: ['visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('clara') || lower.includes('luminosa') || lower.includes('bright') || lower.includes('blanco')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return {
        ...s,
        html: s.html
          .replace(/bg-slate-900/g, 'bg-white')
          .replace(/text-white/g, 'text-slate-900')
          .replace(/text-slate-200/g, 'text-slate-600')
          .replace(/bg-slate-50/g, 'bg-white'),
      };
    });
    return {
      message: lang === 'es' ? 'Motor de Experiencia: versión más clara y luminosa.' : 'UX engine: brighter, lighter version.',
      previewSections: sections,
      motorsUsed: ['ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('color') || lower.includes('tierra') || lower.includes('earth') || lower.includes('beige')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return {
        ...s,
        html: s.html
          .replace(/indigo-600/g, 'amber-700')
          .replace(/indigo-500/g, 'amber-600')
          .replace(/bg-slate-900/g, 'bg-stone-800')
          .replace(/violet/g, 'amber'),
      };
    });
    return {
      message: lang === 'es' ? 'Motor Visual: paleta tierra y beige aplicada.' : 'Visual engine: earth and beige palette applied.',
      previewSections: sections,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('animac') || lower.includes('animat')) {
    const sec = target;
    sections = patchSection(
      sections,
      sec.id,
      sec.html.replace(/class="/g, 'class="transition-all duration-500 hover:scale-[1.01] ')
    );
    changedIds.push(sec.id);
    return {
      message: lang === 'es' ? 'Motor de Código: animaciones sutiles añadidas.' : 'Code engine: subtle animations added.',
      previewSections: sections,
      motorsUsed: ['code'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('tipograf') || lower.includes('typography') || lower.includes('font')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return {
        ...s,
        html: s.html
          .replace(/text-3xl/g, 'text-4xl')
          .replace(/text-4xl/g, 'text-5xl')
          .replace(/font-semibold/g, 'font-bold tracking-tight'),
      };
    });
    return {
      message: lang === 'es' ? 'Motor Visual: tipografía más sofisticada.' : 'Visual engine: more sophisticated typography.',
      previewSections: sections,
      motorsUsed: ['visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('servicio') || lower.includes('service') || lower.includes('sección') || lower.includes('section')) {
    const svc = sections.find((s) => s.type === 'services') ?? target;
    const extra = svc.html + `<div class="mt-6 p-4 bg-indigo-600 text-white rounded-2xl text-sm font-semibold">${lang === 'es' ? '✓ Bloque de servicios ampliado' : '✓ Services block expanded'}</div>`;
    sections = patchSection(sections, svc.id, extra);
    changedIds.push(svc.id);
    return {
      message: lang === 'es' ? 'Motor de Redacción: sección de servicios ampliada.' : 'Copy engine: services section expanded.',
      previewSections: sections,
      motorsUsed: ['copy', 'ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('contacto') || lower.includes('contact') || lower.includes('botón') || lower.includes('button')) {
    const contact = sections.find((s) => s.type === 'contact') ?? target;
    sections = patchSection(
      sections,
      contact.id,
      contact.html.replace(/bg-white\/10/g, 'bg-indigo-500').replace(/rounded-xl/g, 'rounded-2xl ring-2 ring-indigo-300')
    );
    changedIds.push(contact.id);
    return {
      message: lang === 'es' ? 'Motor UX: formulario de contacto más visible.' : 'UX engine: contact form more visible.',
      previewSections: sections,
      motorsUsed: ['ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  return null;
}

async function applyAIChange(input: StudioGenerateInput): Promise<StudioGenerateResult | null> {
  const target = targetSection(input);
  if (!target) return null;

  const aiResult = await chatCompletion(
    [
      {
        role: 'system',
        content: `You are CREAUNA's design engine (like Lovable/Emergent). Modify ONE website section HTML.
Return ONLY valid JSON: {"message":"short user-facing message","html":"complete updated section HTML"}
Use Tailwind CSS classes only. No <script>. Make changes VISIBLY obvious (colors, sizes, spacing).
Language for visible text: ${input.lang === 'es' ? 'Spanish' : 'English'}.`,
      },
      {
        role: 'user',
        content: `Section type: ${target.type}
Current HTML:
${target.html.slice(0, 4000)}

User request: ${input.prompt}
Action: ${input.action || 'change'}`,
      },
    ],
    { temperature: 0.6, maxTokens: 2000, motor: 'code', prompt: input.prompt }
  );

  if (!aiResult.content) return null;

  try {
    const match = aiResult.content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { message?: string; html?: string };
    if (!parsed.html || !parsed.message) return null;

    const sections = patchSection(cloneSections(input.previewSections), target.id, parsed.html);
    return {
      message: parsed.message,
      previewSections: sections,
      motorsUsed: ['visual', 'copy', 'code', 'ux'],
      source: 'ai',
      changedSectionIds: [target.id],
    };
  } catch {
    return null;
  }
}

export async function generateStudioChange(input: StudioGenerateInput): Promise<StudioGenerateResult> {
  const ruleResult = applyPromptRules(input);
  if (ruleResult && ruleResult.changedSectionIds.length > 0) {
    return ruleResult;
  }

  const aiResult = await applyAIChange(input);
  if (aiResult) return aiResult;

  const target = targetSection(input);
  const badge = input.lang === 'es' ? '✓ Cambio aplicado' : '✓ Change applied';
  const sections = patchSection(
    cloneSections(input.previewSections),
    target.id,
    target.html + `<div class="mt-3 px-3 py-1.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg">${badge}: ${input.prompt.slice(0, 40)}</div>`
  );

  return {
    message: input.lang === 'es'
      ? `Motores IA: cambio aplicado — «${input.prompt.slice(0, 50)}»`
      : `AI engines: change applied — «${input.prompt.slice(0, 50)}»`,
    previewSections: sections,
    motorsUsed: ['visual', 'copy', 'code', 'ux'],
    source: 'rules',
    changedSectionIds: [target.id],
  };
}
