import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';

export const FREE_CREDITS = 15;

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  credits: number;
  role: string;
  createdAt: string;
}

function adminEmail(): string | null {
  return process.env.CREAUNA_ADMIN_EMAIL?.trim().toLowerCase() || null;
}

function resolveRole(email: string): string {
  const admin = adminEmail();
  if (admin && email.toLowerCase() === admin) return 'admin';
  return 'user';
}

export async function registerUser(name: string, email: string, password: string): Promise<StoredUser> {
  const normalized = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    throw new Error('Este correo ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: normalized,
      name: name.trim(),
      passwordHash,
      credits: FREE_CREDITS,
      role: resolveRole(normalized),
    },
  });

  await prisma.creditLog.create({
    data: { userId: user.id, delta: FREE_CREDITS, reason: 'welcome_bonus' },
  });

  return toStoredUser(user);
}

export async function authenticateUser(email: string, password: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  const role = resolveRole(normalized);
  if (user.role !== role) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role },
    });
    return toStoredUser(updated);
  }

  return toStoredUser(user);
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toStoredUser(user) : null;
}

export function isDemoAuthEnabled(): boolean {
  if (process.env.CREAUNA_DEMO_AUTH === 'false') return false;
  return process.env.CREAUNA_DEMO_AUTH === 'true' || process.env.NODE_ENV === 'development';
}

export async function createDemoUser(email: string): Promise<StoredUser> {
  const normalized = email.trim().toLowerCase();
  let user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalized,
        name: normalized.split('@')[0],
        passwordHash: await bcrypt.hash(`demo-${Date.now()}`, 8),
        credits: FREE_CREDITS,
        role: resolveRole(normalized),
      },
    });
  }
  return toStoredUser(user);
}

function toStoredUser(user: {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  credits: number;
  role: string;
  createdAt: Date;
}): StoredUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    credits: user.credits,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function hashIp(ip: string): string {
  return createHash('sha256').update(`${ip}:creauna-ip`).digest('hex');
}
