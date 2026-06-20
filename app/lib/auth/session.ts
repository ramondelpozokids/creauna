import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'creauna_session';
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

function getSecret(): string {
  return process.env.CREAUNA_AUTH_SECRET?.trim() || 'creauna-dev-secret-change-me';
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function createSessionToken(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + MAX_AGE_SEC * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionUser & { exp?: number };
    if (!data.id || !data.email || !data.exp || data.exp < Date.now()) return null;
    return { id: data.id, email: data.email, name: data.name || data.email };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
