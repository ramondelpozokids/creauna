import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { getAdminEmail } from '../../../lib/auth/admin';

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim() ?? '';
  return /^postgres(ql)?:\/\//i.test(url);
}

/** Estado público de auth (sin secretos). Útil para comprobar producción. */
export async function GET() {
  let dbOk = false;
  if (isDbConfigured()) {
    try {
      await prisma.user.count();
      dbOk = true;
    } catch {
      dbOk = false;
    }
  }

  const demoAuth =
    process.env.CREAUNA_DEMO_AUTH === 'true' ||
    (process.env.CREAUNA_DEMO_AUTH !== 'false' && process.env.NODE_ENV === 'development');

  return NextResponse.json({
    db: dbOk ? 'ok' : 'unavailable',
    registration: dbOk ? 'open' : 'closed',
    adminEmailConfigured: Boolean(getAdminEmail()),
    adminBootstrapConfigured: Boolean(process.env.CREAUNA_ADMIN_PASSWORD?.trim()),
    demoAuthEnabled: demoAuth,
    notes: {
      es: dbOk
        ? 'Los clientes pueden registrarse en /signup. El superadmin necesita CREAUNA_ADMIN_PASSWORD en Vercel o registrarse una vez en /signup.'
        : 'Configura DATABASE_URL en Vercel para habilitar registro e inicio de sesión.',
      en: dbOk
        ? 'Clients can register at /signup. Superadmin needs CREAUNA_ADMIN_PASSWORD on Vercel or one-time signup at /signup.'
        : 'Set DATABASE_URL on Vercel to enable registration and login.',
    },
  });
}
