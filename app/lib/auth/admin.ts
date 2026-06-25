import { getUserById } from './users';
import type { SessionUser } from './session';

export const UNLIMITED_CREDITS = 999_999;

export function getAdminEmail(): string | null {
  return process.env.CREAUNA_ADMIN_EMAIL?.trim().toLowerCase() || null;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const admin = getAdminEmail();
  if (!admin || !email) return false;
  return email.trim().toLowerCase() === admin;
}

export async function isStudioUnlimited(session: SessionUser | null): Promise<boolean> {
  if (!session?.id) return false;
  if (isAdminEmail(session.email)) return true;
  const user = await getUserById(session.id);
  return user?.role === 'admin' || isAdminEmail(user?.email);
}
