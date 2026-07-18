/**
 * CREAUNA — protección anti-copia en sitios entregados / preview.
 *
 * Honestidad técnica: en un navegador NUNCA se puede impedir al 100% que alguien
 * con DevTools/console vea el HTML. Estas capas dificultan el copiado casual
 * (clic derecho, Ctrl+C, arrastrar imágenes, “ver código”, inspección rápida).
 *
 * - delivery: 5 capas (incluye wipe si detecta DevTools) — export / web publicada
 * - preview: capas 1–3 + consola suave — Studio no se rompe al inspeccionar
 *
 * Uso: injectClientProtection(html, { mode: 'delivery' | 'preview' })
 */

export type ProtectionMode = 'delivery' | 'preview';

export const CREAUNA_SECURITY_CSS = `
<style id="creauna-protect">
  html.cua-protect, html.cua-protect body {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  html.cua-protect input,
  html.cua-protect textarea,
  html.cua-protect [contenteditable="true"] {
    -webkit-user-select: text !important;
    user-select: text !important;
  }
  html.cua-protect img,
  html.cua-protect video,
  html.cua-protect svg,
  html.cua-protect canvas {
    -webkit-user-drag: none !important;
    user-drag: none !important;
    pointer-events: auto;
  }
  html.cua-protect .cua-img-shield {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }
  html.cua-protect .cua-img-shield::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    background: transparent;
  }
</style>
`.trim();

function buildSecurityScript(mode: ProtectionMode): string {
  const wipeOnDevtools = mode === 'delivery';
  return `
(function () {
  if (window.__CUA_PROTECT__) return;
  window.__CUA_PROTECT__ = true;
  var BRAND = 'CREAUNA';
  var WIPE = ${wipeOnDevtools ? 'true' : 'false'};
  try { document.documentElement.classList.add('cua-protect'); } catch (e) {}

  function block(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Capa 1 — CSS: sin selección / sin arrastrar (ver CREAUNA_SECURITY_CSS)
  // Capa 2 — Menú contextual + arrastre de imágenes/medios
  document.addEventListener('contextmenu', block, true);
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.closest('img,video,picture,svg'))) {
      return block(e);
    }
  }, true);

  // Capa 3 — Copiar / cortar / imprimir / guardar / ver código / seleccionar todo
  document.addEventListener('copy', block, true);
  document.addEventListener('cut', block, true);
  document.addEventListener('keydown', function (e) {
    var key = (e.key || '').toLowerCase();
    var ctrl = e.ctrlKey || e.metaKey;
    if (e.key === 'F12') return block(e);
    if (ctrl && e.shiftKey && ['i', 'j', 'c', 'k'].indexOf(key) >= 0) return block(e);
    if (ctrl && ['u', 's', 'p'].indexOf(key) >= 0) return block(e);
    if (ctrl && key === 'c') {
      var tag = (e.target && e.target.tagName) || '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') return block(e);
    }
    if (ctrl && key === 'a') {
      var tagA = (e.target && e.target.tagName) || '';
      if (tagA !== 'INPUT' && tagA !== 'TEXTAREA') return block(e);
    }
  }, true);

  // Capa 4 — Detección de DevTools (solo entrega; disuasión, no garantía)
  if (WIPE) {
    var threshold = 180;
    var tripped = false;
    function checkDevTools() {
      if (tripped) return;
      var w = window.outerWidth - window.innerWidth;
      var h = window.outerHeight - window.innerHeight;
      if (w > threshold || h > threshold) {
        tripped = true;
        try {
          document.documentElement.innerHTML =
            '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#0a0a0a;color:#a1a1aa;padding:24px;text-align:center">' +
            '<div><div style="font-size:40px;margin-bottom:12px">&#128274;</div>' +
            '<h1 style="color:#fafafa;font-size:1.15rem;margin:0 0 8px">Acceso restringido</h1>' +
            '<p style="margin:0;font-size:0.85rem">Contenido protegido. ' + BRAND + ' · Ramón del Pozo Rott.</p></div></body>';
        } catch (err) {}
      }
    }
    setInterval(checkDevTools, 1200);
    checkDevTools();
  }

  // Capa 5 — Consola: aviso + vaciado periódico (no impide DevTools avanzado)
  try {
    console.log('%c[' + BRAND + '] Protecci\\u00f3n anti-copia activa. Uso no autorizado prohibido.', 'color:#6366f1;font-weight:bold');
    setInterval(function () {
      try {
        console.clear();
        console.log('%c[' + BRAND + '] Contenido protegido.', 'color:#6366f1');
      } catch (e2) {}
    }, 4000);
  } catch (e3) {}
})();
`.trim();
}

/** @deprecated Prefer injectClientProtection — se mantiene por compatibilidad. */
export const CREAUNA_SECURITY_SCRIPT = buildSecurityScript('delivery');

/** Inyecta CSS + script de protección en un documento HTML completo. */
export function injectClientProtection(
  html: string,
  options?: { mode?: ProtectionMode }
): string {
  if (!html || html.includes('__CUA_PROTECT__') || html.includes('id="creauna-protect"')) {
    return html;
  }

  const mode = options?.mode ?? 'delivery';
  let out = html;
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${CREAUNA_SECURITY_CSS}\n</head>`);
  } else if (/<html[^>]*>/i.test(out)) {
    out = out.replace(/<html[^>]*>/i, (m) => `${m}\n<head>${CREAUNA_SECURITY_CSS}</head>`);
  } else {
    out = `${CREAUNA_SECURITY_CSS}\n${out}`;
  }

  const scriptTag = `<script>${buildSecurityScript(mode)}</script>`;
  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${scriptTag}\n</body>`);
  } else {
    out = `${out}\n${scriptTag}`;
  }
  return out;
}
