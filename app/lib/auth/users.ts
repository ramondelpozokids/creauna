import { createHash } from 'crypto';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const users = new Map<string, StoredUser>();

function hashPassword(password: string): string {
  return createHash('sha256').update(`${password}:creauna-salt`).digest('hex');
}

export function registerUser(name: string, email: string, password: string): StoredUser {
  const normalized = email.trim().toLowerCase();
  if (users.has(normalized)) {
    throw new Error('Este correo ya está registrado');
  }
  const user: StoredUser = {
    id: `usr_${Date.now()}`,
    email: normalized,
    name: name.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.set(normalized, user);
  return user;
}

export function authenticateUser(email: string, password: string): StoredUser | null {
  const normalized = email.trim().toLowerCase();
  const user = users.get(normalized);
  if (!user) return null;
  if (user.passwordHash !== hashPassword(password)) return null;
  return user;
}

export function isDemoAuthEnabled(): boolean {
  return process.env.CREAUNA_DEMO_AUTH === 'true' || process.env.NODE_ENV === 'development';
}
