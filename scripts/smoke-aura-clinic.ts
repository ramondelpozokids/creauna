/**
 * Smoke Aura Clinic — Director Creativo LLM + pipeline (sin Studio UI).
 * Uso: npm run smoke:aura  (o dotenv -e .env.local -- npx tsx scripts/smoke-aura-clinic.ts)
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { runAgencyPipeline } from '../app/lib/ai/agencyPipeline';
import { runCreativeDirectorAsync } from '../app/lib/ai/creative/creativeDirector';
import { getConfiguredProviders } from '../app/lib/ai/providers';

const AURA = `# Brief de Prueba Nº1 — Clínica de Medicina Estética Premium
## Información General
**Nombre de la clínica:** Aura Clinic
**Sector:** Medicina estética avanzada
**Ubicación:** Madrid, España
**Tipo de negocio:** Clínica privada especializada en medicina estética facial y corporal.
---
Inspiración: Una mezcla entre una clínica privada suiza, un hotel de cinco estrellas y una marca de lujo.
No debe parecer una clínica tradicional.
CTA principal: Reservar primera consulta.
CTA secundarios: Solicitar valoración. Ver tratamientos.
## Servicios principales
* Ácido hialurónico.
* Neuromoduladores.
* Bioestimuladores de colágeno.
* Skinboosters.
* Peelings médicos.
* Láser dermatológico.
`;

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

async function main() {
  const providers = getConfiguredProviders();
  console.log('Providers:', providers.length ? providers.join(', ') : '(none)');
  if (!providers.length) {
    console.error('FAIL need at least one LLM provider in .env.local for Aura smoke');
    process.exit(1);
  }

  const cd = await runCreativeDirectorAsync(AURA, 'es', { entropy: 'smoke-aura' });
  console.log('Director:', cd.source, cd.provider, cd.brief.sectorId, cd.brief.businessName);
  assert('LLM source', cd.source === 'llm');
  assert('sector clinic', cd.brief.sectorId === 'clinic');
  assert('name Aura', /aura/i.test(cd.brief.businessName));
  assert('CTA consulta', /consulta/i.test(cd.brief.primaryCta));
  assert('no hotel CTA', !/estancia|suites/i.test(cd.brief.primaryCta + cd.brief.secondaryCta));
  assert('services medical', cd.brief.services.some((s) => /hialur|neuromod|láser|laser|skin/i.test(s)));

  const agency = await runAgencyPipeline(AURA, 'es');
  const html = agency.previewSections[0]?.html || '';
  assert('agency ok', agency.ok && html.length > 8000);
  assert('providersUsed has LLM', agency.providersUsed.some((p) => p !== 'creative_director_fallback'));
  assert('html Aura', /Aura/i.test(html));
  assert('html no Suites row', !/>\s*Suites\s*</i.test(html));
  assert('html no Reservar estancia', !/Reservar estancia/i.test(html));
  assert('message mentions motor or director', /Director Creativo|razonad/i.test(agency.message));

  const outDir = join(process.cwd(), 'tmp', 'smoke-aura');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'aura.html'), html, 'utf8');
  writeFileSync(
    join(outDir, 'brief.json'),
    JSON.stringify(
      {
        source: cd.source,
        provider: cd.provider,
        sectorId: cd.brief.sectorId,
        businessName: cd.brief.businessName,
        primaryCta: cd.brief.primaryCta,
        services: cd.brief.services,
        providersUsed: agency.providersUsed,
        message: agency.message,
      },
      null,
      2
    ),
    'utf8'
  );
  console.log('Wrote', outDir);
  console.log(process.exitCode ? 'SMOKE FAILED' : 'SMOKE OK');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
