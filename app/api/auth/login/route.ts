import { NextResponse } from 'next/server';
import { authenticateUser, createDemoUser, isDemoAuthEnabled, upsertAdminUser } from '../../../lib/auth/users';
import { setSessionCookie } from '../../../lib/auth/session';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { isValidEmail, requireFields, sanitizeText } from '../../../lib/api/validate';
import { isAdminEmail } from '../../../lib/auth/admin';

function getAdminBootstrapPassword(): string | null {
  return process.env.CREAUNA_ADMIN_PASSWORD?.trim() || null;
}

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

    if (!user && isAdminEmail(email)) {
      const bootstrapPassword = getAdminBootstrapPassword();
      if (bootstrapPassword && password === bootstrapPassword) {
        user = await upsertAdminUser(email, password);
      }
    }

    if (!user && isDemoAuthEnabled()) {
      user = await createDemoUser(email);
      demo = true;
    }

    if (!user) {
      if (isAdminEmail(email) && !getAdminBootstrapPassword()) {
        return NextResponse.json(
          {
            error:
              'Cuenta admin pendiente de configurar. Añade CREAUNA_ADMIN_PASSWORD en Vercel y redeploy, o regístrate en /signup con este correo.',
          },
          { status: 401 }
        );
      }
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
    if (isDbUnavailable(error)) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Configura DATABASE_URL en Vercel.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
