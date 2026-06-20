import { NextResponse } from 'next/server';
import { authenticateUser, createDemoUser, isDemoAuthEnabled } from '../../../lib/auth/users';
import { setSessionCookie } from '../../../lib/auth/session';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { isValidEmail, requireFields, sanitizeText } from '../../../lib/api/validate';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`auth-login:${ip}`, 15, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const email = sanitizeText(body.email, 200);
    const password = sanitizeText(body.password, 200);

    const missing = requireFields({ email, password }, ['email', 'password']);
    if (missing) return NextResponse.json({ error: missing }, { status: 400 });
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Correo no válido' }, { status: 400 });
    }

    let user = await authenticateUser(email, password);
    let demo = false;

    if (!user && isDemoAuthEnabled()) {
      user = await createDemoUser(email);
      demo = true;
    }

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    await setSessionCookie({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, credits: user.credits },
      demo,
    });
  } catch (error) {
    console.error('api/auth/login:', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
