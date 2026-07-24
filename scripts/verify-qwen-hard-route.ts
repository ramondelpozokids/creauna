/**
 * Smoke: briefs duros → ruta Qwen + gates (sin entregar basura).
 * npx tsx scripts/verify-qwen-hard-route.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { wantsQwenHardBuild, gateQwenHardBuild } from '../app/lib/ai/creative/qwenHardBuild';
import { isSpectaclePrompt } from '../app/lib/ai/creative/spectacleExperience';
import { isProviderConfigured } from '../app/lib/ai/providers';

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

const VELOCITY = `Diseña una experiencia revolucionaria VELOCITY X bicicletas e-bike.
Three.js, configurador, scroll cinematográfico, producto bicicleta futurista legible.`;

const AETHER = `AETHER MOTORS — The Future of Motion.
Experiencia interactiva coche eléctrico, configurador 3D, lujo y tecnología.`;

const DENTAL = `Clínica dental Lumina en Madrid con citas online. Web profesional elegante.`;

assert('velocity wants qwen hard', wantsQwenHardBuild(VELOCITY));
assert('velocity is spectacle', isSpectaclePrompt(VELOCITY));
assert('aether wants qwen hard', wantsQwenHardBuild(AETHER));
assert('dental does NOT force qwen hard', !wantsQwenHardBuild(DENTAL));

const shellOnly = `<!DOCTYPE html><html><body><iframe src="/demos/experiencias/creauna-vx/index.html"></iframe></body></html>`;
assert('gate rejects iframe shell', !gateQwenHardBuild(shellOnly, VELOCITY).ok);

const fakeGood = `<!DOCTYPE html><html lang="es"><head><title>VX</title></head><body>
<main><section id="inicio"><h1>Bicicleta futurista</h1><canvas id="c"></canvas>
<p>e-bike configurador three.js rueda cuadro</p></section>
${'<section><p>bloque de contenido de marca</p></section>'.repeat(200)}
</main></body></html>`;
const padded = fakeGood.replace('</body>', `${'<!-- pad xxxxxxxxxxxxxxxxxxxx -->\n'.repeat(600)}</body>`);
assert(`gate accepts dense bike html (len ${padded.length})`, gateQwenHardBuild(padded, VELOCITY).ok);

console.log('qwen configured?', isProviderConfigured('qwen'));
console.log('done');
