/**
 * Gestoría / legales en modal + hero/about + sin WA.
 * npx tsx scripts/verify-gestoria-polish.ts
 */
import { polishCatalogLayout, stripLegalPageDump, stripUnwantedWhatsApp } from '../app/lib/ai/polishCatalogLayout';
import { gateProfessionalImages } from '../app/lib/ai/hardenSiteImages';
import { injectSiteChrome, withAgencyChromePrompt, promptWantsWhatsApp } from '../app/lib/ai/siteChrome';
import { IMAGE_BANK } from '../app/lib/ai/imageBank';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

const BRIEF = `Gestoría Integral RDPR en Madrid.
Asesoría fiscal, contable, laboral y jurídica. Sin WhatsApp. Sin carrito.
Aviso legal, privacidad y cookies.`;

const dirty = `<!DOCTYPE html><html lang="es"><body>
<header><h1>Gestoría</h1></header>
<section id="inicio" class="hero" style="background:#1a1a1a;min-height:70vh">
  <h1>Tu Socio Estratégico</h1>
  <p>Soluciones fiscales</p>
</section>
<section id="nosotros">
  <h2>Quiénes Somos</h2>
  <p>Equipo profesional.</p>
  <div style="background:linear-gradient(#8B7355,#C4A882);min-height:280px;border-radius:1rem"></div>
</section>
<section id="contacto"><h2>Contacto</h2><form></form></section>
<footer>
  <p>© RDPR</p>
  <a href="#privacidad">Política de Privacidad</a>
  <a href="#datos">Protección de Datos</a>
</footer>
<section id="privacidad"><h1>Política de Privacidad</h1><p>Dump largo...</p></section>
<section><h2>Protección de Datos</h2><p>Más dump RGPD...</p>
  <h3>1. Responsable del Tratamiento</h3><p>x</p>
  <h3>6. Ejercicio de Derechos</h3><p>y</p>
</section>
<a href="https://wa.me/34600123456" class="whatsapp-float" aria-label="WhatsApp">WA</a>
</body></html>`;

async function main() {
  assert('prompt sin WA', !promptWantsWhatsApp(BRIEF));

  let html = stripLegalPageDump(dirty);
  assert('strip: sin sección privacidad dump', !/id=["']privacidad["']/i.test(html) || /dialog/i.test(html));
  assert('strip: sin h2 Protección dump antes de chrome', !/<h2[^>]*>\s*Protección de Datos/i.test(html.split('</footer>')[0] || ''));

  html = injectSiteChrome(html, {
    prompt: withAgencyChromePrompt(BRIEF),
    lang: 'es',
    businessName: 'Gestoría Integral RDPR',
  });
  assert('chrome: modal legal overlay', /id=["']cua-legal-modal["']/i.test(html));
  assert('chrome: openModal aviso', /openModal\s*\(\s*['"]aviso['"]/i.test(html));
  assert('chrome: openModal privacidad', /openModal\s*\(\s*['"]privacidad['"]/i.test(html));
  assert('chrome: modales.aviso content', /"aviso"\s*:|"aviso":\{|"aviso":\s*\{/i.test(html) || /Aviso Legal/i.test(html));

  html = polishCatalogLayout(html, {
    prompt: BRIEF,
    packUrls: [IMAGE_BANK.corporate.hero, IMAGE_BANK.corporate.team, ...IMAGE_BANK.corporate.gallery],
    variant: 'corporate',
  });
  html = stripUnwantedWhatsApp(html, BRIEF);

  const afterFooter = (html.split(/<\/footer>/i)[1] || '').split(/<\/body>/i)[0] || '';
  assert('tras footer: hay modal legal', /id=["']cua-legal-modal["']/i.test(afterFooter) && /openModal\s*\(/i.test(afterFooter));
  assert('tras footer: no dump Política de Privacidad como h1', !/<h1[^>]*>\s*Pol[ií]tica de Privacidad/i.test(afterFooter));
  assert('tras footer: no sección dump', !/<section[^>]*>\s*<h[12][^>]*>\s*Protecci/i.test(afterFooter));
  assert('sin WA FAB', !/aria-label=["']WhatsApp["']/i.test(html) && !/whatsapp-float/i.test(html));

  const gated = gateProfessionalImages(html, [
    IMAGE_BANK.corporate.hero,
    IMAGE_BANK.corporate.team,
    ...IMAGE_BANK.corporate.gallery,
  ]);
  html = gated.html;
  assert('gate ok', gated.ok);
  assert('hero con img http', /data-cua-hero-bg[\s\S]{0,400}<img[^>]+src=["']https?:\/\//i.test(html));
  assert('about con img http', /Qui[eé]nes Somos[\s\S]{0,2500}<img[^>]+src=["']https?:\/\//i.test(html) || /data-cua-about-img[\s\S]{0,200}<img[^>]+src=["']https?:\/\//i.test(html));

  if (process.exitCode) {
    console.log('\nGestoría polish FAILED');
    process.exit(1);
  }
  console.log('\nGestoría polish OK');
}

main();
