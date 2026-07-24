/**
 * Smoke ciclo fases CREAUNA (sin llamar Qwen).
 * npx tsx scripts/verify-build-phases.ts
 */

import {
  clientWantsExpandPages,
  clientWantsIndexRefineOnly,
  messageIndexPreview,
  stampBuildPhase,
  readBuildPhase,
  embedSitePages,
  extractSitePages,
} from '../app/lib/ai/creaunaBuildPhases';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

assert(
  'expand: resto de páginas',
  clientWantsExpandPages('me gusta, genera el resto de páginas legales y contacto')
);
assert(
  'expand: contacto.html',
  clientWantsExpandPages('haz contacto.html y aviso-legal.html')
);
assert('no expand: solo color', !clientWantsExpandPages('cambia el color del botón a azul'));
assert('refine: color', clientWantsIndexRefineOnly('cambia el color del botón a azul'));
assert(
  'refine not when expand',
  !clientWantsIndexRefineOnly('me gusta, construye el resto de páginas')
);

const html = stampBuildPhase('<!DOCTYPE html><html><head></head><body>x</body></html>', 'index_preview');
assert('phase stamp', readBuildPhase(html) === 'index_preview');

const withPages = embedSitePages(html, {
  'contacto.html': '<!DOCTYPE html><html><body>contacto largo suficiente aqui</body></html>'.padEnd(300, '.'),
});
assert('embed pages', Object.keys(extractSitePages(withPages)).includes('contacto.html'));

assert('preview message asks', /resto de páginas|remaining pages/i.test(messageIndexPreview('es', 'VX')));

console.log('done');
