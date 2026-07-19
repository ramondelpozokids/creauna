/**
 * Extras fuera del Studio estándar (Stripe, carrito real, SaaS, hosting…).
 * No se implementan en el chat: se deriva al formulario /contacto para presupuesto.
 * Si el brief EXPLÍCITAMENTE rechaza esas cosas (NO carrito, sin Stripe…), no bloquear.
 */

function explicitlyRejectsExtras(prompt: string): boolean {
  return /(?:\bno\b|\bsin\b|without|never|nunca|prohibido|not\s+an?\s+e-?commerce|no\s+es\s+e-?commerce)[^\n.]{0,40}(?:stripe|checkout|carrito|pasarela|pago\s+online|shopping\s*cart|payment\s+gateway|woocommerce|shopify)/i.test(
    prompt
  ) || /(?:stripe|checkout|carrito|pasarela|shopping\s*cart|payment\s+gateway)[^\n.]{0,30}(?:\bno\b|prohibido|nunca|not\s+allowed)/i.test(
    prompt
  );
}

export function isCustomQuoteRequest(prompt: string): boolean {
  if (explicitlyRejectsExtras(prompt)) return false;
  return /stripe|pasarela\s+de\s+pago|pago\s+online|cobrar\s+con\s+tarjeta|carrito\s+de\s+compra|checkout\s+real|woocommerce|shopify|paypal|paddle|saas|mvp|crm|erp|panel\s+de\s+administraci[oó]n|login\s+de\s+usuarios|base\s+de\s+datos|supabase|alojamiento|hosting|dominio\s+y\s+hosting|github\s+sync|api\s+keys?|claves?\s+api|integraci[oó]n\s+con\s+api/i.test(
    prompt
  );
}

/** Tema corto para prellenar el formulario. */
export function customQuoteTopic(prompt: string, lang: 'es' | 'en'): string {
  const bits: string[] = [];
  if (/stripe|pasarela|pago|paypal|paddle|checkout/i.test(prompt)) {
    bits.push(lang === 'es' ? 'Pasarela de pago / Stripe' : 'Payment gateway / Stripe');
  }
  if (/carrito|tienda\s+online|ecommerce|e-commerce|woocommerce|shopify/i.test(prompt)) {
    bits.push(lang === 'es' ? 'Carrito y tienda online' : 'Cart and online store');
  }
  if (/saas|mvp|crm|erp|login|base\s+de\s+datos|panel\s+de\s+admin/i.test(prompt)) {
    bits.push(lang === 'es' ? 'App / panel / SaaS a medida' : 'Custom app / admin / SaaS');
  }
  if (/alojamiento|hosting|dominio/i.test(prompt)) {
    bits.push(lang === 'es' ? 'Dominio y hosting' : 'Domain and hosting');
  }
  if (/api\s+keys?|claves?\s+api|integraci[oó]n/i.test(prompt)) {
    bits.push(lang === 'es' ? 'Integraciones / API keys' : 'Integrations / API keys');
  }
  return bits.length ? bits.join(', ') : lang === 'es' ? 'Proyecto especial' : 'Special project';
}

export function buildContactQuoteUrl(prompt: string, lang: 'es' | 'en'): string {
  const topic = customQuoteTopic(prompt, lang);
  const params = new URLSearchParams({
    tipo: 'proyecto-especial',
    tema: topic,
  });
  return `/contacto?${params.toString()}`;
}

export function customQuoteStudioMessage(prompt: string, lang: 'es' | 'en'): string {
  const url = buildContactQuoteUrl(prompt, lang);
  const topic = customQuoteTopic(prompt, lang);
  if (lang === 'en') {
    return `That feature (${topic}) is outside the standard Studio website flow — it needs a custom quote.

Fill in the form explaining exactly what you need and we’ll prepare a personal quote:

${url}

Meanwhile I can keep refining your premium website in Studio.`;
  }
  return `Eso que pides (${topic}) no entra en el flujo estándar del Studio: es un desarrollo a medida y requiere presupuesto.

Rellena el formulario contándonos exactamente lo que necesitas y te preparamos un presupuesto personalizado:

${url}

Mientras tanto, en el Studio puedo seguir puliendo tu web premium.`;
}
