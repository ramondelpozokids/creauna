/**
 * Constructor Qwen — HTML profesional largo / experiencias (briefs duros).
 * Brief → Qwen (code) → revisar gates → solo entonces entregar.
 * No clona demos Desktop; crea desde el brief del cliente.
 */

import { constructorSystemPreamble } from '../creaunaConstructorManifesto';
import {
  chatCompletion,
  isProviderConfigured,
  type AiProvider,
} from '../providers';
import type { CreativeBrief } from './creativeBrief';
import { isBikePrompt } from './designDna';
import { isSpectaclePrompt } from './spectacleExperience';
import { stampBuildPhase } from '../creaunaBuildPhases';

const BUILD_MAX_TOKENS = 32768;

export function wantsQwenHardBuild(prompt: string): boolean {
  if (isSpectaclePrompt(prompt)) return true;
  // Movilidad / producto premium con carga creativa alta
  if (
    isBikePrompt(prompt) &&
    /premium|alta\s+gama|futur|e-?bike|configur|experiencia|3d|interact/i.test(prompt)
  ) {
    return true;
  }
  if (
    /autom[oó]vil|supercar|deportivo|mobility|veh[ií]culo\s+el[eé]ctr|aether|tesla|hypercar|coche\s+el[eé]ctr/i.test(
      prompt
    ) &&
    /futur|experiencia|3d|configur|immers|revolucion|impresionante|lujo|tecnolog/i.test(prompt)
  ) {
    return true;
  }
  // Briefs muy largos y exigentes (tipo “obra”, multipágina implícita)
  if (prompt.length > 1800 && /three\.?js|webgl|gsap|scroll|configurador|part[ií]culas/i.test(prompt)) {
    return true;
  }
  return false;
}

function extractHtml(raw: string): string | null {
  const candidate = raw
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const docMatch = candidate.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
  if (docMatch) return docMatch[1];
  if (candidate.startsWith('<!DOCTYPE') || candidate.startsWith('<html')) {
    const end = candidate.lastIndexOf('</html>');
    if (end > 0) return candidate.slice(0, end + 7);
    return candidate;
  }
  return null;
}

function isCompleteHtml(html: string): boolean {
  return /<!DOCTYPE\s+html/i.test(html) && /<\/html>/i.test(html) && html.length >= 18000;
}

export interface QwenBuildGate {
  ok: boolean;
  issues: string[];
}

/** Revisión antes de entregar — producto final según brief, no borrador. */
export function gateQwenHardBuild(html: string, prompt: string): QwenBuildGate {
  const issues: string[] = [];
  if (!/<!DOCTYPE\s+html/i.test(html)) issues.push('missing_doctype');
  if (!/<\/html>/i.test(html)) issues.push('missing_html_close');
  if (html.length < 18000) issues.push('too_short');
  if (!/<main[\s>]|id=["'](inicio|hero)/i.test(html) && !/<section[\s>]/i.test(html)) {
    issues.push('no_sections');
  }
  // Producto legible según vertical
  if (isBikePrompt(prompt)) {
    const productSignal =
      /bicicleta|e-?bike|bike|rueda|cuadro|three|webgl|canvas|configur/i.test(html) &&
      !/oficina|coding|laptop\s+code|corporate\s+stock/i.test(html.slice(0, 8000));
    if (!productSignal) issues.push('bike_product_not_clear');
  }
  if (/autom[oó]vil|coche|veh[ií]culo|aether|supercar/i.test(prompt)) {
    if (!/coche|auto|veh[ií]culo|motor|canvas|three|webgl|configur/i.test(html)) {
      issues.push('auto_product_not_clear');
    }
  }
  // No entregar shell vacío / iframe-only
  if (/creauna-vx\/index\.html/i.test(html) && html.length < 5000) {
    issues.push('iframe_shell_only');
  }
  return { ok: issues.length === 0, issues };
}

async function continueHtml(
  partial: string,
  prompt: string,
  lang: 'es' | 'en'
): Promise<string> {
  let html = partial;
  for (let i = 0; i < 3; i++) {
    if (isCompleteHtml(html) && html.length > 28000) break;
    if (/<\/html>/i.test(html) && html.length > 22000) break;

    const cont = await chatCompletion(
      [
        {
          role: 'system',
          content:
            lang === 'es'
              ? 'Continúa el documento HTML exactamente donde quedó. No repitas el inicio. Cierra secciones y termina con </body></html>. SOLO HTML.'
              : 'Continue the HTML exactly where it left off. Do not repeat the start. Close sections and end with </body></html>. ONLY HTML.',
        },
        {
          role: 'user',
          content:
            lang === 'es'
              ? `HTML incompleto. Últimos 7000 caracteres:\n\n${html.slice(-7000)}\n\nContinúa hasta cerrar el documento.`
              : `Incomplete HTML. Last 7000 chars:\n\n${html.slice(-7000)}\n\nContinue until closed.`,
        },
      ],
      {
        motor: 'code',
        preferProvider: 'qwen',
        maxTokens: BUILD_MAX_TOKENS,
        temperature: 0.2,
        prompt,
      }
    );
    if (!cont.content) break;
    const extracted = extractHtml(cont.content);
    if (extracted && extracted.length > html.length && /<\/html>/i.test(extracted)) {
      html = extracted;
      break;
    }
    const piece = cont.content
      .replace(/^```(?:html)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    html = `${html}\n${piece}`;
    if (/<\/html>/i.test(html)) {
      const end = html.lastIndexOf('</html>');
      if (end > 0) html = html.slice(0, end + 7);
      break;
    }
  }
  return html;
}

function buildSystemPrompt(lang: 'es' | 'en', brief: CreativeBrief): string {
  const manifesto = constructorSystemPreamble(lang);
  const productHint =
    brief.sectorId === 'bike'
      ? lang === 'es'
        ? 'El PRODUCTO es una BICICLETA futurista LEGIBLE (ruedas, cuadro, sillín, manillar). Si usas Three.js/canvas, la silueta debe verse clara sobre fondo oscuro (titanio/luz, no negro sobre negro).'
        : 'PRODUCT is a READABLE futuristic BICYCLE (wheels, frame, saddle, bars). If Three.js/canvas, silhouette must read on dark bg (titanium/light, not black-on-black).'
      : lang === 'es'
        ? 'El PRODUCTO del brief debe verse claro en el hero (no stock corporativo genérico).'
        : 'The brief PRODUCT must be clear in the hero (no generic corporate stock).';

  return `${manifesto}

ROL: Eres el constructor HTML de CREAUNA (motor Qwen). Entregas el PRODUCTO FINAL de la PÁGINA PRINCIPAL a la primera.
${productHint}

ALCANCE (OBLIGATORIO):
- Construye SOLO la index.html (una única página principal completa).
- NO generes contacto.html, aviso-legal.html ni otras páginas satélite en este paso.
- En el footer puedes ENLAZAR a contacto.html / aviso-legal.html / privacidad.html / cookies.html / mapa-sitio.html (href relativos); el contenido de esas páginas se creará DESPUÉS cuando el cliente lo pida.
- PROHIBIDO volcar textos legales enteros debajo del footer (no sustituyen las páginas satélite).

OBLIGATORIO:
- Un único documento HTML5 completo (<!DOCTYPE html> … </html>).
- Experiencia de marca profesional: hero impactante, secciones distintas, tipografía expresiva, CSS variables, motion con sentido.
- Si el brief pide 3D/configurador/scroll cinematográfico: impleméntalo (Three.js/GSAP por CDN está permitido).
- Copy y estructura ÚNICOS según el brief. PROHIBIDO clonar demos ajenas.
- Imágenes: URLs reales (Unsplash/Pexels) coherentes con el producto; o canvas 3D del producto. Si falta una imagen coherente, deja un data-cua-image-slot claro (Gemini/Fal la rellenarán).
- Responsive, SEO básico (title, description), accesibilidad razonable.
- SOLO HTML (puedes incluir <style> y <script>). Sin markdown ni explicaciones.

Marca del brief: ${brief.businessName}
Sector: ${brief.sectorId}
Hero: ${brief.heroTitle} — ${brief.heroSubtitle}
CTA: ${brief.primaryCta} / ${brief.secondaryCta}
Servicios/modelos: ${(brief.services || []).join(', ')}
Posicionamiento: ${brief.positioning}`;
}

export interface QwenHardBuildResult {
  ok: boolean;
  html: string;
  provider: AiProvider | 'rules';
  gate: QwenBuildGate;
  attempts: number;
}

/**
 * Construye con Qwen el HTML largo del brief duro.
 * Si Qwen no está configurado → ok:false (el pipeline continúa por otro camino).
 */
export async function runQwenHardBuild(
  prompt: string,
  lang: 'es' | 'en',
  brief: CreativeBrief
): Promise<QwenHardBuildResult> {
  if (!isProviderConfigured('qwen')) {
    return {
      ok: false,
      html: '',
      provider: 'rules',
      gate: { ok: false, issues: ['qwen_not_configured'] },
      attempts: 0,
    };
  }

  const system = buildSystemPrompt(lang, brief);
  const user =
    lang === 'es'
      ? `BRIEF DEL CLIENTE (construye la web/experiencia FINAL según esto, nada de borrador):\n\n${prompt.slice(0, 28000)}\n\nDevuelve SOLO el HTML completo.`
      : `CLIENT BRIEF (build the FINAL site/experience from this — not a draft):\n\n${prompt.slice(0, 28000)}\n\nReturn ONLY the full HTML.`;

  let attempts = 0;
  let html = '';
  let provider: AiProvider | 'rules' = 'qwen';

  // Intento 1
  attempts += 1;
  const first = await chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    {
      motor: 'code',
      preferProvider: 'qwen',
      maxTokens: BUILD_MAX_TOKENS,
      temperature: 0.45,
      prompt,
    }
  );
  provider = first.provider;
  if (first.content) {
    html = extractHtml(first.content) || '';
  }

  if (html && (!isCompleteHtml(html) || html.length < 28000)) {
    attempts += 1;
    html = await continueHtml(html, prompt, lang);
  }

  // Reintento único si el gate de producto falla y hay HTML
  let gate = gateQwenHardBuild(html, prompt);
  if ((!gate.ok || !html) && isProviderConfigured('qwen')) {
    attempts += 1;
    const repair = await chatCompletion(
      [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content:
            lang === 'es'
              ? `La entrega anterior falló la revisión interna (${gate.issues.join(', ') || 'vacío'}).
Vuelve a crear el HTML COMPLETO cumpliendo el brief.
El producto del brief debe verse CLARO en el hero (luz suficiente, silueta legible).
SOLO HTML.\n\nBRIEF:\n${prompt.slice(0, 20000)}`
              : `Previous delivery failed internal review (${gate.issues.join(', ') || 'empty'}).
Rebuild FULL HTML matching the brief.
Product must be CLEAR in the hero. ONLY HTML.\n\nBRIEF:\n${prompt.slice(0, 20000)}`,
        },
      ],
      {
        motor: 'code',
        preferProvider: 'qwen',
        maxTokens: BUILD_MAX_TOKENS,
        temperature: 0.35,
        prompt,
      }
    );
    if (repair.content) {
      provider = repair.provider;
      const repaired = extractHtml(repair.content);
      if (repaired) {
        html = repaired;
        if (!isCompleteHtml(html)) html = await continueHtml(html, prompt, lang);
      }
    }
    gate = gateQwenHardBuild(html, prompt);
  }

  return {
    ok: gate.ok && Boolean(html),
    html: html ? stampBuildPhase(html, 'index_preview') : html,
    provider,
    gate,
    attempts,
  };
}
