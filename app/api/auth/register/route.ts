import { NextResponse } from 'next/server';
import { registerUser } from '../../../lib/auth/users';
import { setSessionCookie } from '../../../lib/auth/session';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { isValidEmail, requireFields, sanitizeText } from '../../../lib/api/validate';

function isDbUnavailable(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('DATABASE_URL') ||
    msg.includes('PrismaClientInitializationError') ||
    msg.includes("Can't reach database")
  );
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`auth-register:${ip}`, 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const name = sanitizeText(body.name, 120);
    const email = sanitizeText(body.email, 200);
    const password = sanitizeText(body.password, 200);
    const company = sanitizeText(body.company, 120);

    const missing = requireFields({ name, email, password }, ['name', 'email', 'password']);
    if (missing) return NextResponse.json({ error: missing }, { status: 400 });
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Correo no válido' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
    }

    const user = await registerUser(name, email, password);
    await setSessionCookie({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, credits: user.credits, company: company || null },
    });
  } catch (error) {
    if (isDbUnavailable(error)) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Configura DATABASE_URL en Vercel.' },
        { status: 503 }
      );
    }
    const message = error instanceof Error ? error.message : 'Error al registrar';
    const status = message.includes('registrado') ? 409 : 500;
    console.error('api/auth/register:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
