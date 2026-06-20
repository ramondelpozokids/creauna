export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function parseResendError(body: string): string {
  try {
    const data = JSON.parse(body) as { message?: string; error?: string };
    const msg = data.message || data.error || '';
    if (/only send testing emails to your own/i.test(msg)) {
      return 'Resend: verifica el dominio ramondelpozorott.es en resend.com/domains y usa CONTACT_TO_EMAIL=info@ramondelpozorott.es en Vercel.';
    }
    if (msg) return msg;
  } catch {
    /* ignore */
  }
  return 'No se pudo enviar el correo con Resend';
}

function getRecipients(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL?.trim() || 'info@ramondelpozorott.es';
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

function getFromAddress(): string {
  const custom = process.env.CONTACT_FROM_EMAIL?.trim();
  if (custom) return custom;

  const domain = process.env.RESEND_FROM_DOMAIN?.trim();
  if (domain) return `CREAUNA <contacto@${domain}>`;

  return 'CREAUNA <onboarding@resend.dev>';
}

export async function sendContactEmail(payload: ContactPayload): Promise<{ sent: boolean; mode: 'resend' | 'log' }> {
  const to = getRecipients();
  const from = getFromAddress();
  const apiKey = process.env.RESEND_API_KEY?.trim();

  const subject = `[CREAUNA] Nuevo contacto — ${payload.type}`;
  const text = [
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Teléfono: ${payload.phone}` : null,
    `Tipo: ${payload.type}`,
    '',
    payload.message,
  ].filter(Boolean).join('\n');

  if (!apiKey) {
    console.info('[CREAUNA contact]', { to, subject, text });
    return { sent: true, mode: 'log' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('resend error:', res.status, err);
    throw new Error(parseResendError(err));
  }

  return { sent: true, mode: 'resend' };
}
