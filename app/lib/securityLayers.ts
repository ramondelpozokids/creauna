/**
 * CREAUNA — 4 capas de seguridad cliente
 * Copiar este script en el layout de cualquier proyecto.
 * Uso: <script dangerouslySetInnerHTML={{ __html: CREAUNA_SECURITY_SCRIPT }} />
 */
export const CREAUNA_SECURITY_SCRIPT = `
(function() {
  var BRAND = 'CREAUNA';
  // Capa 1: Bloquear menú contextual
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  // Capa 2: Bloquear atajos de inspección (F12, Ctrl+Shift+I/J/C, Ctrl+U)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I','J','C','K'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.altKey && ['I','J','C'].includes(e.key))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
  // Capa 3: Detectar DevTools abierto (funciona en ventana normal e incógnito)
  var threshold = 160;
  var checkDevTools = function() {
    var widthGap = window.outerWidth - window.innerWidth;
    var heightGap = window.outerHeight - window.innerHeight;
    if (widthGap > threshold || heightGap > threshold) {
      document.documentElement.innerHTML = '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#0f172a;color:#94a3b8;padding:24px;text-align:center"><div><div style="font-size:48px;margin-bottom:16px">🔒</div><h1 style="color:#f8fafc;font-size:1.25rem;margin:0 0 8px">Acceso restringido</h1><p style="margin:0;font-size:0.875rem">Inspección no autorizada. Propiedad de Ramón del Pozo Rott.</p></div></body>';
    }
  };
  setInterval(checkDevTools, 1000);
  checkDevTools();
  // Capa 4: Desactivar selección de texto en código sensible (opcional)
  document.addEventListener('selectstart', function(e) {
    if (e.target && e.target.closest && e.target.closest('pre, code, .no-select')) {
      e.preventDefault();
    }
  });
  // Mensaje en consola (único acceso permitido)
  console.log('%c[' + BRAND + '] 4 capas de seguridad activas. Propiedad de Ramón del Pozo Rott.', 'color:#6366f1;font-size:9px');
})();
`.trim();
