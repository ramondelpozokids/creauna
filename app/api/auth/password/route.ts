import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/auth/session';
import { updateUserPassword } from '../../../lib/auth/users';
import { sanitizeText } from '../../../lib/api/validate';

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const currentPassword = sanitizeText(body.currentPassword, 200);
    const newPassword = sanitizeText(body.newPassword, 200);

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Completa todos los campos' }, { status: 400 });
    }

    const result = await updateUserPassword(session.id, currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('api/auth/password:', error);
    return NextResponse.json({ error: 'Error al cambiar la contraseña' }, { status: 500 });
  }
}
