/**
 * Smoke: brief e-bike → sector bike + pack bike + imágenes de bicicleta.
 * npx tsx scripts/verify-bike-sector.ts
 */

import { runCreativeDirector } from '../app/lib/ai/creative/creativeDirector';
import { resolveDesignDna } from '../app/lib/ai/creative/designDna';
import { parseCreativeBriefJson } from '../app/lib/ai/creative/llmCreativeDirector';
import { runCreativePipeline } from '../app/lib/ai/creative/runCreativePipeline';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

const VELOCITY = `Marca de movilidad eléctrica premium VELOCITY X.
Bicicletas e-bike de alta gama. Ingeniería, diseño y producto.
CTA: Configura tu bicicleta. Explora, configura, rueda.`;

async function main() {
  const h = runCreativeDirector(VELOCITY, 'es', { entropy: 'vx-smoke' });
  assert(`heuristic sector=bike (got ${h.sectorId})`, h.sectorId === 'bike');
  const dna = resolveDesignDna(h);
  assert(`dna pack=bike (got ${dna.imagePackKey})`, dna.imagePackKey === 'bike');

  const wrongCorporate = JSON.stringify({
    sectorId: 'corporate',
    audience: 'Professionals',
    positioning: 'Premium mobility brand',
    brandTone: 'corporate',
    artDirection: 'clinicalLight',
    visualLanguage: 'airAndWhite',
    heroFamily: 'editorialStack',
    density: 'balanced',
    rhythm: 'steady',
    typeScale: 'editorial',
    photoStyle: 'office stock',
    iconStyle: 'line',
    storytellingArc: ['hero', 'about', 'services', 'gallery', 'contact'],
    businessName: 'VELOCITY X',
    heroTitle: 'El futuro de la movilidad',
    heroSubtitle: 'Bicicletas de alta gama.',
    primaryCta: 'Configura tu bicicleta',
    secondaryCta: 'Explorar',
    services: ['E-bikes', 'Configurador', 'Experiencias', 'Lab'],
    aboutHeadline: 'Ingeniería sobre dos ruedas',
    aboutBody: 'Cada bicicleta nace de precisión.',
    city: 'Madrid',
    country: 'España',
  });
  const parsed = parseCreativeBriefJson(wrongCorporate, VELOCITY, 'es', 'clamp');
  assert(`LLM clamp sector=bike (got ${parsed?.sectorId})`, parsed?.sectorId === 'bike');
  assert(
    'LLM clamp photoStyle bikes',
    Boolean(parsed?.photoStyle && /bicycle|e-bike/i.test(parsed.photoStyle))
  );

  const pipe = await runCreativePipeline(VELOCITY, 'es', { entropy: 'vx-smoke', scoreFloor: 80 });
  assert(`pipeline sector=bike (got ${pipe.brief.sectorId})`, pipe.brief.sectorId === 'bike');
  assert(
    `pipeline pack=bike (got ${resolveDesignDna(pipe.brief).imagePackKey})`,
    resolveDesignDna(pipe.brief).imagePackKey === 'bike'
  );

  const bikeIds = [
    '1541625602330',
    '1532298229144',
    '1485965120184',
    '1571333250630',
    '1576435728678',
  ];
  const hits = bikeIds.filter((id) => pipe.html.includes(id));
  assert(`html contains bike Unsplash ids (${hits.length})`, hits.length >= 1);
  assert('html length', pipe.html.length > 8000);
  console.log('score', pipe.rubric.total, 'director', pipe.directorSource);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
