import { injectSiteChrome, detectRequestedModules, describeAppliedModules } from '../app/lib/ai/siteChrome';
const base = '<!DOCTYPE html><html><head></head><body><header>VELORA</header><main><section id=\"inicio\">x</section></main><footer>f</footer></body></html>';
const prompt = 'quiero tambien paginas de aviso legal, politica de privacidad, politica de cookies, mapa del sitio y un scoll up, y boton de whatsapp y todas las redes sociales';
console.log('modules', detectRequestedModules(prompt));
const out = injectSiteChrome(base, { prompt, lang: 'es', businessName: 'VELORA' });
console.log('delta', out.length - base.length);
console.log(describeAppliedModules(prompt, 'es'));
console.log({ legal: /aviso-legal/.test(out), wa: /wa\.me/.test(out), scroll: /cua-scroll-top/.test(out), social: /data-cua-socials/.test(out) });
