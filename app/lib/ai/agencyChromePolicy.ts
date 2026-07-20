/**
 * Política de chrome de agencia (legales / WhatsApp).
 * Módulo pequeño para no acoplar el pipeline a exports locales de siteChrome.
 */

/** Sufijo que fuerza solo legales de baseline profesional (RGPD). */
export const AGENCY_LEGAL_FORCE_SUFFIX =
  '\n aviso legal privacidad cookies mapa del sitio';

/** @deprecated usar AGENCY_LEGAL_FORCE_SUFFIX */
export const AGENCY_CHROME_FORCE_SUFFIX = AGENCY_LEGAL_FORCE_SUFFIX;

export function promptWantsWhatsApp(prompt: string): boolean {
  if (!/whatsapp|wa\.me|whats\s*app/i.test(prompt)) return false;
  if (
    /(?:sin|without|no\s+(?:quiero|necesito|incluy|pong|uses?|usar))\s+[^\n.]{0,20}whats\s*app/i.test(
      prompt
    ) ||
    /whats\s*app[^\n.]{0,20}(?:no|nunca|prohibid)/i.test(prompt)
  ) {
    return false;
  }
  return true;
}

/** Prompt listo para injectSiteChrome: legales siempre; WA/redes solo si el brief los nombra. */
export function withAgencyChromePrompt(prompt: string): string {
  if (/aviso\s+legal|privacidad|cookies/i.test(prompt)) return prompt;
  return `${prompt}${AGENCY_LEGAL_FORCE_SUFFIX}`;
}
