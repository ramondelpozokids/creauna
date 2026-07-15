/**
 * Verificación offline del motor CREAUNA (sin servidor, sin claves IA).
 * Ejecutar: npx tsx scripts/verify-engine.ts
 */
import { analyzeIntent, resolveTemplateSlug } from '../app/lib/ai/intentAnalyzer';
import { generateInitialSite } from '../app/lib/ai/siteGenerator';
import { getEngineHealth } from '../app/lib/ai/engineHealth';
import { validatePreviewSections } from '../app/lib/studio/sectionValidator';

const SECTOR_TESTS = [
  { sector: 'Reformas', prompt: 'Web para empresa de reformas integrales en Madrid con galeria de obras', expect: 'flow' },
  { sector: 'Inmobiliaria', prompt: 'Inmobiliaria con listado de pisos y contacto', expect: 'habitat' },
  { sector: 'Dental', prompt: 'Clinica dental con ortodoncia y reserva de cita', expect: 'care' },
  { sector: 'Restaurante', prompt: 'Restaurante gourmet con carta y reservas', expect: 'vesper' },
  { sector: 'Taller', prompt: 'Taller mecanico de coches con citas online', expect: 'pistons' },
  { sector: 'Abogados', prompt: 'Despacho de abogados laboralistas con servicios', expect: 'lex' },
  { sector: 'Asesoria', prompt: 'Gestoria y asesoria fiscal para autonomos', expect: 'ledger' },
  { sector: 'Solar', prompt: 'Empresa energia solar fotovoltaica autoconsumo', expect: 'volt' },
  { sector: 'Arquitectura', prompt: 'Estudio de arquitectura e interiorismo portfolio', expect: 'blueprint' },
  { sector: 'Fisioterapia', prompt: 'Clinica de fisioterapia y rehabilitacion', expect: 'care' },
  { sector: 'Gimnasio', prompt: 'Gimnasio crossfit con planes mensuales', expect: 'forge' },
  { sector: 'Turismo rural', prompt: 'Casa rural en la sierra con reservas', expect: 'haven' },
  { sector: 'Peluqueria', prompt: 'Peluqueria y salon de belleza con reservas', expect: 'lumen' },
  { sector: 'Electricista', prompt: 'Electricista urgencias 24h fontaneria', expect: 'flow' },
  { sector: 'SaaS', prompt: 'Startup SaaS software B2B con demo', expect: 'arc' },
];

const BUILD_TESTS = [
  'Web elegante para clínica dental Lumina en Madrid con citas online',
  'Kebab Hut en Vallecas con carta y pedidos WhatsApp',
  'Royal Bang tattoo studio en Madrid con galería portfolio',
  'Empresa solar Helios con instalaciones fotovoltaicas y baterías',
  'Gestoría Campón asesoría fiscal laboral y contable',
  'Tienda online de moda premium con carrito Stripe checkout lookbook Zara Massimo Dutti',
];

async function main() {
  console.log('\n=== CREAUNA Motor — verificación offline ===\n');

  const health = getEngineHealth();
  console.log(`IA habilitada: ${health.aiEnabled ? 'sí' : 'no (solo reglas)'}`);
  if (health.warnings.length) {
    for (const w of health.warnings) console.log(`  ⚠ ${w}`);
  }
  console.log('');

  let intentOk = 0;
  let intentFail = 0;

  for (const t of SECTOR_TESTS) {
    const intent = analyzeIntent(t.prompt, 'es');
    const slug = resolveTemplateSlug(intent.templateSlug);
    if (slug === t.expect) {
      console.log(`OK  intent ${t.sector} → ${slug}`);
      intentOk++;
    } else {
      console.log(`FAIL intent ${t.sector} → ${slug} (esperado ${t.expect})`);
      intentFail++;
    }
  }

  console.log(`\nIntent routing: ${intentOk}/${SECTOR_TESTS.length} OK\n`);

  let buildOk = 0;
  let buildFail = 0;

  for (const prompt of BUILD_TESTS) {
    try {
      const result = await generateInitialSite(prompt, 'es');
      const validation = validatePreviewSections(result.previewSections, result.changedSectionIds);
      const sectionCount = result.previewSections.length;
      const hasHero = result.previewSections.some((s) => s.type === 'hero' || s.html.includes('<h1'));

      const isFullPage = result.previewSections.some((s) => s.type === 'fullpage');
      if ((isFullPage || sectionCount >= 3) && hasHero && validation.ok) {
        console.log(
          `OK  build «${prompt.slice(0, 45)}…» → ${result.templateSlug} (${sectionCount} secciones, ${result.source})`
        );
        buildOk++;
      } else {
        console.log(
          `FAIL build «${prompt.slice(0, 45)}…» → secciones=${sectionCount} valid=${validation.ok} errors=${validation.errors.join('; ')}`
        );
        buildFail++;
      }
    } catch (err) {
      console.log(`ERR build «${prompt.slice(0, 45)}…» → ${err instanceof Error ? err.message : err}`);
      buildFail++;
    }
  }

  console.log(`\nGeneración inicial: ${buildOk}/${BUILD_TESTS.length} OK`);
  console.log(`\n=== Total: ${intentOk + buildOk} OK · ${intentFail + buildFail} fallos ===\n`);

  if (intentFail + buildFail > 0) process.exit(1);
}

main();
