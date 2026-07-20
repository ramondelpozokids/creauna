/**
 * Verifica que un brief ultra-largo (pelucas/moda) NUNCA devuelve vacío.
 * Espeja el path de producción: deterministic → siteChrome (legales/WA).
 * npx tsx scripts/verify-never-empty.ts
 */
import { buildAgencyPlanFromBrief } from '../app/lib/ai/agencyPipeline';
import { buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { buildDeterministicAgencyHtml } from '../app/lib/ai/agencyDeterministicBuild';
import { detectVariant } from '../app/lib/ai/businessProfiles';
import { isSkeletonLanding, isUnacceptableAgencyHtml, hasHeroWithCopy } from '../app/lib/ai/promptFirstQuality';
import { isMetaHeroPhrase } from '../app/lib/ai/agencyPipeline';
import { injectSiteChrome, withAgencyChromePrompt } from '../app/lib/ai/siteChrome';
import { brieflyRejectsOnlineCheckout } from '../app/lib/ai/customQuoteGate';

const WIG_BRIEF = `# Create an Ultra-Premium Modern Website for a Wig, Fashion & Accessories Store
Wigs, Women's Fashion, Fashion Accessories. Luxury boutique. NOT e-commerce.
NO shopping cart, NO checkout, NO payment. Catalogue with WhatsApp.
Inspired by Apple, Zara, COS, Chanel, Dior, Loewe, Aesop.
Colors #111111 #FAFAFA #C68E6B #F5EFE8. Playfair Display + Inter + Poppins.
Hero full-bleed, Why Choose Us, Featured Collections Wigs Clothing Accessories,
12 products with prices and WhatsApp buttons, gallery 20 images, services, 10 reviews,
about, contact form, floating WhatsApp, footer, legal pages, sitemap, SEO.
Luxury Blonde Wig €245, Natural Brown Wig €185, Elegant Dress €69, Handbag €55.
`;

async function main() {
  const variant = detectVariant(WIG_BRIEF);
  const plan = buildAgencyPlanFromBrief(WIG_BRIEF, 'es');
  const pack = buildBriefImagePack(WIG_BRIEF, 'es');
  let html = buildDeterministicAgencyHtml(plan, pack, WIG_BRIEF, 'es');
  // Path real de entrega: chrome siempre (legales + WA)
  html = injectSiteChrome(html, {
    prompt: withAgencyChromePrompt(WIG_BRIEF),
    lang: 'es',
    businessName: plan.businessName,
  });

  const checks = [
    ['variant fashion', variant === 'fashion'],
    ['html > 20KB', html.length > 20000],
    ['has H1', /<h1\b/i.test(html)],
    [
      'H1 not meta',
      !isMetaHeroPhrase(
        html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
      ),
    ],
    ['has hero copy', hasHeroWithCopy(html)],
    ['not skeleton', !isSkeletonLanding(html)],
    ['has WhatsApp CTA', /wa\.me|#contacto|WhatsApp/i.test(html)],
    [
      'no cart/stripe',
      brieflyRejectsOnlineCheckout(WIG_BRIEF) &&
        !/stripe\.com|add\s+to\s+cart|shopping[\s-]?cart|checkout\s+payment/i.test(html),
    ],
    ['has products', /Luxury Blonde Wig|Elegant Dress|€245/i.test(html)],
    ['has legal', /aviso-legal|privacidad|cookies|data-cua-legal/i.test(html)],
    ['google fonts', /fonts\.googleapis\.com/i.test(html)],
    // Motor real: hero legible ~70vh (tope 820px), no 85/100vh pantallazo
    ['min-h 70vh', /min-h-\[70vh\]/i.test(html)],
  ] as const;

  let fail = 0;
  for (const [label, ok] of checks) {
    console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
    if (!ok) fail++;
  }
  console.log(`\nHTML size: ${html.length} · pack=${pack.variant} · H1=«${plan.heroTitle}»`);
  if (fail) process.exit(1);
  if (isUnacceptableAgencyHtml(html, WIG_BRIEF) && html.length < 25000) {
    console.error('FAIL quality gate');
    process.exit(1);
  }
  console.log('\nNunca vacío: deterministic + chrome OK\n');
}

main();
