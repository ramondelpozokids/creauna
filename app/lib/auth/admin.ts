import { getUserById } from './users';
import type { SessionUser } from './session';

export const UNLIMITED_CREDITS = 999_999;

export async function isStudioUnlimited(session: SessionUser | null): Promise<boolean> {
  if (!session?.id) return false;
  const user = await getUserById(session.id);
  return user?.role === 'admin';
}
