import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/auth/session';
import { getUserById } from '../../../lib/auth/users';
import { isAdminEmail } from '../../../lib/auth/admin';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await getUserById(session.id);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const unlimited = user.role === 'admin' || isAdminEmail(user.email);

  return NextResponse.json({
    authenticated: true,
    unlimited,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
    },
  });
}
