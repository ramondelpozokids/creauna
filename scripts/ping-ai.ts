/**
 * Ping en vivo de proveedores IA (sin exponer keys).
 * Uso: npx tsx scripts/ping-ai.ts
 * Requiere .env.local con las API keys.
 */
import { pingAllProviders, summarizePingResults } from '../app/lib/ai/providerPing';

async function main() {
  console.log('\n=== PING IA (llamada real a cada API) ===\n');
  const started = Date.now();
  const providers = await pingAllProviders();
  const summary = summarizePingResults(providers);

  for (const p of providers) {
    const icon = p.status === 'ok' ? 'OK' : p.status === 'missing' ? '—' : 'FAIL';
    const lat = p.latencyMs != null ? `${p.latencyMs}ms` : '';
    console.log(`${icon.padEnd(5)} ${p.label.padEnd(8)} ${p.model ?? ''} ${lat}`);
    if (p.error) console.log(`      ${p.error}`);
    else if (p.sample) console.log(`      → ${p.sample}`);
  }

  console.log(`\nResumen: ${summary.ok} OK · ${summary.errors} error · ${summary.missing} sin key · ${Date.now() - started}ms`);
  console.log(summary.allMotorsReady ? 'Motores Studio: LISTOS' : 'Motores Studio: falta algún proveedor principal\n');
  process.exit(summary.errors > 0 || summary.missing > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
