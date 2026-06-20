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

export async function sendContactEmail(payload: ContactPayload): Promise<{ sent: boolean; mode: 'resend' | 'log' }> {
  const to = process.env.CONTACT_TO_EMAIL?.trim() || 'info@ramondelpozorott.es';
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || 'CREAUNA <onboarding@resend.dev>';
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
      to: [to],
      reply_to: payload.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('resend error:', res.status, err);
    throw new Error('No se pudo enviar el correo');
  }

  return { sent: true, mode: 'resend' };
}
