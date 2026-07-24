/**
 * Modo espectáculo — briefs que piden experiencia (3D, cine, configurador), no landing.
 * Componentes craft reutilizables; página/copy únicos por brief.
 */

import type { CreativeBrief } from './creativeBrief';
import { isBikePrompt } from './designDna';

export function isSpectaclePrompt(prompt: string): boolean {
  const p = prompt.toLowerCase();
  const experience =
    /experiencia|obra de arte interactiva|scroll cinematogr|three\.?js|webgl|configurador|videojuego|aaa|pantalla completa|flotando|girando|part[ií]culas|niebla|desmonta|explosi[oó]n 3d|ciencia ficci[oó]n|no quiero una web|no dise[nñ]es una tienda|impresionante jam[aá]s|absolutely revolutionary|immersive|future of motion|futuro de la movilidad/i.test(
      prompt
    );
  const luxuryTech =
    /lujo|tecnolog[ií]a|velocidad|ingenier[ií]a|futuro|minimalismo|exclusividad|grafeno|hologr[aá]fic/i.test(
      p
    );
  const mobilitySpectacle =
    (isBikePrompt(prompt) ||
      /autom[oó]vil|supercar|coche\s+el[eé]ctr|veh[ií]culo\s+el[eé]ctr|aether\s+motors/i.test(prompt)) &&
    luxuryTech &&
    /3d|interact|configur|cinemat|immers|experiencia|revolucion/i.test(p);
  return experience || mobilitySpectacle;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface SpectacleBuildResult {
  html: string;
  mode: 'spectacle';
  engine: 'creauna-vx';
}

/**
 * Genera una experiencia espectáculo única por brief.
 * Motor 3D craft compartido; marca, copy y modelos salen del brief (no clona demos ajenas).
 */
export function buildSpectacleExperienceHtml(
  brief: CreativeBrief,
  prompt: string
): SpectacleBuildResult {
  const name = brief.businessName || 'VELOCITY X';
  const heroTitle = brief.heroTitle || (brief.lang === 'es' ? 'Silencio a ochenta.' : 'Silence at eighty.');
  const heroSub =
    brief.heroSubtitle ||
    brief.aboutBody ||
    (brief.lang === 'es'
      ? 'No vendemos bicicletas. Vendemos la sensación de viajar al futuro.'
      : 'We do not sell bikes. We sell the feeling of traveling to the future.');
  const cta = brief.primaryCta || (brief.lang === 'es' ? 'Entrar en la narrativa' : 'Enter the narrative');
  const cta2 = brief.secondaryCta || (brief.lang === 'es' ? 'Abrir la forja' : 'Open the forge');
  const models = (brief.services?.length ? brief.services : ['Atlas', 'Aether', 'Horizon 2040']).slice(0, 10);
  const seed = brief.uniquenessSeed || `${name}-spectacle`;
  const accent = '#3aa0ff';
  const config = {
    brand: name,
    heroTitle,
    heroSubtitle: heroSub,
    primaryCta: cta,
    secondaryCta: cta2,
    models,
    seed,
    accent,
    lang: brief.lang,
    positioning: brief.positioning,
    aboutHeadline: brief.aboutHeadline,
    aboutBody: brief.aboutBody,
    promptDigest: prompt.slice(0, 240),
  };

  const modelsJson = JSON.stringify(config).replace(/</g, '\\u003c');

  const html = `<!DOCTYPE html>
<html lang="${esc(brief.lang)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(name)} — Experiencia</title>
<meta name="description" content="${esc(heroSub).slice(0, 160)}" />
<meta name="creauna-mode" content="spectacle" />
<meta name="creauna-engine" content="creauna-vx" />
<link rel="canonical" href="/demos/experiencias/creauna-vx/index.html" />
<style>
  html,body{margin:0;height:100%;background:#050607;color:#f4f6f8;font-family:system-ui,sans-serif;}
  .vx-boot{position:fixed;inset:0;display:grid;place-items:center;background:#050607;z-index:5;transition:opacity .6s;}
  .vx-boot.is-out{opacity:0;pointer-events:none;}
  .vx-boot p{letter-spacing:.28em;text-transform:uppercase;font-size:.72rem;color:#3aa0ff;}
  iframe{border:0;width:100%;height:100%;display:block;background:#050607;}
</style>
</head>
<body>
  <div class="vx-boot" id="boot"><p>${esc(name)} · cargando experiencia</p></div>
  <iframe
    id="vx-frame"
    title="${esc(name)} experiencia 3D"
    src="/demos/experiencias/creauna-vx/index.html?spectacle=1"
    allow="fullscreen"
  ></iframe>
  <script>
    window.__CREAUNA_SPECTACLE__ = ${modelsJson};
    const frame = document.getElementById('vx-frame');
    frame.addEventListener('load', () => {
      try {
        frame.contentWindow.__CREAUNA_SPECTACLE__ = window.__CREAUNA_SPECTACLE__;
        frame.contentWindow.dispatchEvent(new CustomEvent('creauna-spectacle', { detail: window.__CREAUNA_SPECTACLE__ }));
      } catch (e) {}
      document.getElementById('boot').classList.add('is-out');
    });
  </script>
</body>
</html>`;

  return { html, mode: 'spectacle', engine: 'creauna-vx' };
}
