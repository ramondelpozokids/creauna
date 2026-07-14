import type { PremiumStarterItem, PremiumStarterPersonalization } from '../../data/premiumStarters';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(html: string, from: string, to: string): string {
  if (!from || from === to) return html;
  return html.split(from).join(to);
}

function formatPhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('34')) return digits;
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

function formatPhoneTel(phoneE164: string): string {
  return `+${phoneE164}`;
}

function buildNavLogoHtml(businessName: string, originalNavLogo: string): string {
  const parts = businessName.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts.slice(0, -1).join(' ');
    const last = parts[parts.length - 1];
    return `${first} <span>${last}</span>`;
  }
  return businessName;
}

function buildMetaDescription(
  starter: PremiumStarterItem,
  data: PremiumStarterPersonalization & { phone: string }
): string {
  const city = data.citySeo?.split(' - ')[0] ?? 'tu ciudad';
  const tail = starter.defaults.metaDescription.split('.').slice(1).join('.').trim();
  const body = tail || starter.defaults.metaDescription;
  return `${data.businessName} en ${city}. ${body}${body.endsWith('.') ? '' : '.'} Tel: ${data.phone}`;
}

export function mergePersonalization(
  starter: PremiumStarterItem,
  input?: Partial<PremiumStarterPersonalization>
): Required<PremiumStarterPersonalization> & { phoneE164: string; navLogoHtml: string; metaDescription: string } {
  const merged = {
    businessName: input?.businessName?.trim() || starter.defaults.businessName,
    subtitle: input?.subtitle?.trim() || starter.defaults.subtitle,
    tagline: input?.tagline?.trim() || starter.defaults.tagline,
    phone: input?.phone?.trim() || starter.defaults.phone,
    email: input?.email?.trim() || starter.defaults.email,
    address: input?.address?.trim() || starter.defaults.address,
    citySeo: input?.citySeo?.trim() || starter.defaults.citySeo,
    heroImage: input?.heroImage?.trim() || starter.defaults.heroImage,
  };
  const phoneE164 = formatPhoneE164(merged.phone);
  return {
    ...merged,
    phoneE164,
    navLogoHtml: buildNavLogoHtml(merged.businessName, starter.defaults.navLogoHtml),
    metaDescription: buildMetaDescription(starter, { ...merged, phone: merged.phone }),
  };
}

/** Aplica personalización acotada sobre el HTML de una muestra premium (sin regenerar diseño). */
export function personalizePremiumStarterHtml(
  html: string,
  starter: PremiumStarterItem,
  input?: Partial<PremiumStarterPersonalization>
): string {
  const d = mergePersonalization(starter, input);
  const prev = starter.defaults;
  let out = html;

  const pairs: [string, string][] = [
    [prev.businessName, d.businessName],
    [prev.navLogoHtml, d.navLogoHtml],
    [prev.subtitle, d.subtitle],
    [prev.tagline, d.tagline],
    [prev.phone, d.phone],
    [prev.phoneE164, d.phoneE164],
    [prev.email, d.email],
    [prev.address, d.address],
    [prev.citySeo, d.citySeo],
    [prev.heroImage, d.heroImage],
    [prev.metaDescription, d.metaDescription],
    [`tel:${formatPhoneTel(prev.phoneE164)}`, `tel:${formatPhoneTel(d.phoneE164)}`],
    [`wa.me/${prev.phoneE164}`, `wa.me/${d.phoneE164}`],
    [
      `C. Puerto de Canencia, 7<br>Puente de Vallecas<br>28038 Madrid, España`,
      d.address.includes('<br>')
        ? d.address
        : d.address.replace(/, /g, '<br>'),
    ],
  ];

  for (const [from, to] of pairs) {
    out = replaceAll(out, from, to);
  }

  out = out.replace(
    new RegExp(`<title>${escapeRegExp(prev.businessName)}[^<]*</title>`, 'i'),
    `<title>${d.businessName} | ${d.citySeo}</title>`
  );

  return out;
}

/** Extrae datos de personalización desde un prompt en lenguaje natural (reglas simples). */
export function parsePersonalizationFromPrompt(
  prompt: string,
  current: PremiumStarterPersonalization
): Partial<PremiumStarterPersonalization> {
  const lower = prompt.toLowerCase();
  const patch: Partial<PremiumStarterPersonalization> = {};

  const nameMatch =
    prompt.match(/(?:se llama|nombre(?:\s+del\s+negocio)?|cambia(?:r)?\s+(?:el\s+)?nombre)\s+(?:a\s+|por\s+)?[«"']?([^«"'\n.]+)[»"']?/i) ||
    prompt.match(/(?:mi\s+restaurante|mi\s+negocio)\s+es\s+[«"']?([^«"'\n.]+)[»"']?/i);
  if (nameMatch?.[1]) patch.businessName = nameMatch[1].trim();

  const phoneMatch = prompt.match(/(?:tel[eé]fono|móvil|whatsapp|llamar)\s*(?:a\s+|es\s+|:)?\s*([\d\s+]{9,})/i);
  if (phoneMatch?.[1]) patch.phone = phoneMatch[1].replace(/\s+/g, ' ').trim();

  const emailMatch = prompt.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
  if (emailMatch?.[0]) patch.email = emailMatch[0];

  const addressMatch = prompt.match(
    /(?:direcci[oó]n|ubicaci[oó]n|estamos en)\s*(?:es\s+|:)?\s*[«"']?([^«"'\n]+)[»"']?/i
  );
  if (addressMatch?.[1] && addressMatch[1].length > 8) patch.address = addressMatch[1].trim();

  const taglineMatch = prompt.match(/(?:eslogan|tagline|frase)\s*(?:es\s+|:)?\s*[«"']([^«"']+)[«"']/i);
  if (taglineMatch?.[1]) patch.tagline = `"${taglineMatch[1].trim()}"`;

  if (/carta|menú|menu/.test(lower) && !patch.businessName) {
    /* sin cambio de nombre — el cliente puede pedir carta en otro flujo */
  }

  return Object.keys(patch).length > 0 ? patch : {};
}
