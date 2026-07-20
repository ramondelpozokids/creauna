/**
 * Verify Creative Director — smoke + comprensión Aura (LLM si hay keys).
 * npx tsx scripts/verify-creative-director.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { runCreativeDirector, runCreativeDirectorAsync } from '../app/lib/ai/creative/creativeDirector';
import { resolveDesignDna, listDesignDnaSectors } from '../app/lib/ai/creative/designDna';
import { listAllLayouts } from '../app/lib/ai/creative/library';
import { composeSelection, compositionDistance } from '../app/lib/ai/creative/compositionEngine';
import { runCreativePipeline } from '../app/lib/ai/creative/runCreativePipeline';
import { shouldBlockFullRebuild, extractCreativeMeta } from '../app/lib/ai/creative/preserveDnaChange';
import { parseCreativeBriefJson } from '../app/lib/ai/creative/llmCreativeDirector';
import { getConfiguredProviders } from '../app/lib/ai/providers';

/** Solo lectura de .env.local para scripts (nunca escribe). */
function loadEnvLocalReadonly() {
  const p = join(process.cwd(), '.env.local');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvLocalReadonly();

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

const AURA_BRIEF = `# Brief — Clínica de Medicina Estética Premium
**Nombre de la clínica:** Aura Clinic
**Sector:** Medicina estética avanzada
**Ubicación:** Madrid, España
Inspiración: mezcla entre clínica privada suiza, hotel de cinco estrellas y marca de lujo.
CTA principal: Reservar primera consulta
## Servicios principales
* Ácido hialurónico.
* Neuromoduladores.
* Skinboosters.
* Láser dermatológico.
`;

async function main() {
  const briefs = [
    'Clínica dental premium Madrid',
    'Restaurante italiano',
    'Abogados mercantiles',
    'Hotel boutique',
    'Agencia de arquitectura',
  ];
  const sectors = new Set<string>();
  for (const b of briefs) {
    const cb = runCreativeDirector(b, 'es');
    sectors.add(cb.sectorId);
    assert(`CreativeBrief no HTML for ${cb.sectorId}`, !('html' in cb));
    assert(`has artDirection ${cb.sectorId}`, Boolean(cb.artDirection));
    assert(`has aboutHeadline ${cb.sectorId}`, Boolean(cb.aboutHeadline));
    const dna = resolveDesignDna(cb);
    assert(`DNA id ${dna.id}`, dna.id.startsWith('dna-'));
  }
  assert('5 distinct sectors', sectors.size >= 5);
  assert('layouts ≥40', listAllLayouts().length >= 40);
  assert('layouts ≥120 scaled', listAllLayouts().length >= 120);
  assert('DNA sectors include clinic', listDesignDnaSectors().includes('clinic'));

  const a = runCreativeDirector(briefs[0], 'es', { entropy: 'a' });
  const b = runCreativeDirector(briefs[0], 'es', { entropy: 'b' });
  const sa = composeSelection(a, resolveDesignDna(a));
  const sb = composeSelection(b, resolveDesignDna(b));
  assert('diversity distance > 0', compositionDistance(sa, sb) > 0);

  const pipe = await runCreativePipeline(briefs[0], 'es', { entropy: 'verify', scoreFloor: 90 });
  assert('pipeline html', pipe.html.length > 8000);
  assert('pipeline rubric ≥90', pipe.rubric.total >= 90);
  assert('creative meta', extractCreativeMeta(pipe.html).isCreative);
  assert('directorSource set', pipe.directorSource === 'llm' || pipe.directorSource === 'heuristic_fallback');
  assert(
    'block rebuild',
    shouldBlockFullRebuild(pipe.html, 'cambia el color del botón')
  );
  assert(
    'allow explicit redesign',
    !shouldBlockFullRebuild(pipe.html, 'rediseña toda la web desde cero')
  );

  // Comprensión vía parse (contrato LLM) — no reglas hardcoded Aura
  const sampleLlmJson = JSON.stringify({
    sectorId: 'clinic',
    audience: 'Profesionales 30-60',
    positioning: 'Medicina estética premium',
    brandTone: 'luxury',
    artDirection: 'aspirationalLuxury',
    visualLanguage: 'airAndWhite',
    heroFamily: 'editorialStack',
    density: 'sparse',
    rhythm: 'editorialBreaks',
    typeScale: 'editorial',
    photoStyle: 'editorial clinic light',
    iconStyle: 'line',
    storytellingArc: ['hero', 'about', 'services', 'gallery', 'contact'],
    businessName: 'Aura Clinic',
    heroTitle: 'Belleza natural, criterio médico',
    heroSubtitle: 'Medicina estética avanzada en Madrid.',
    primaryCta: 'Reservar primera consulta',
    secondaryCta: 'Ver tratamientos',
    services: ['Ácido hialurónico', 'Neuromoduladores', 'Skinboosters', 'Láser dermatológico'],
    aboutHeadline: 'Clínica privada con criterio médico',
    aboutBody: 'Resultados naturales, tecnología al servicio de la belleza.',
    address: 'Madrid, España',
    hours: null,
    wantsWhatsApp: false,
    forbidCart: true,
    rationale: 'Negocio real = clínica estética; hotel solo inspiración.',
  });
  const parsed = parseCreativeBriefJson(sampleLlmJson, AURA_BRIEF, 'es', 'parse-aura');
  assert('parse Aura sector clinic', parsed?.sectorId === 'clinic');
  assert('parse Aura name', /aura\s*clinic/i.test(parsed?.businessName || ''));
  assert('parse Aura CTA', /consulta/i.test(parsed?.primaryCta || ''));
  assert('parse Aura no hotel CTA', !/estancia|suites/i.test(parsed?.primaryCta || ''));
  assert('parse never leaks photoStyle as about', parsed?.aboutBody !== parsed?.photoStyle);

  const providers = getConfiguredProviders();
  console.log(`Providers configured: ${providers.length ? providers.join(', ') : '(none)'}`);

  if (providers.length > 0) {
    const auraCd = await runCreativeDirectorAsync(AURA_BRIEF, 'es', { entropy: 'aura-llm' });
    assert('Aura LLM source', auraCd.source === 'llm');
    assert('Aura LLM sector=clinic', auraCd.brief.sectorId === 'clinic');
    assert('Aura LLM name', /aura/i.test(auraCd.brief.businessName));
    assert('Aura LLM not hotel CTAs', !/estancia|suites/i.test(auraCd.brief.primaryCta + auraCd.brief.secondaryCta));
    const auraPipe = await runCreativePipeline(AURA_BRIEF, 'es', {
      entropy: 'aura-pipe',
      scoreFloor: 90,
    });
    assert('Aura pipe LLM', auraPipe.directorSource === 'llm');
    assert('Aura html name', /Aura/i.test(auraPipe.html));
    assert('Aura html not Suites service', !/>\s*Suites\s*</i.test(auraPipe.html));
    assert('Aura rubric ≥90', auraPipe.rubric.total >= 90);
    assert('Aura providers listed', auraPipe.directorProvider !== 'rules');
  } else {
    console.log('SKIP Aura LLM live checks (no API keys) — parse contract still verified');
  }

  console.log(process.exitCode ? 'VERIFY FAILED' : 'VERIFY OK');
}

main();
