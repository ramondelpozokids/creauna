import { prisma } from './db';
import { FREE_CREDITS, hashIp } from './auth/users';
import { UNLIMITED_CREDITS, isAdminEmail } from './auth/admin';

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim() ?? '';
  // Prisma de CREAUNA es PostgreSQL (Neon). Una URL mongodb+srv (p. ej. de otro proyecto) no cuenta.
  return /^postgres(ql)?:\/\//i.test(url);
}

/** Créditos guest en memoria cuando no hay Postgres (desarrollo local). */
const devGuestCredits = new Map<string, number>();

export interface CreditStatus {
  credits: number;
  source: 'user' | 'guest';
  userId?: string;
  unlimited?: boolean;
}

async function isAdminUser(userId: string, email?: string | null): Promise<boolean> {
  if (isAdminEmail(email)) return true;
  if (!isDbConfigured()) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, email: true } });
  if (!user) return false;
  return user.role === 'admin' || isAdminEmail(user.email);
}

function unlimitedStatus(userId?: string): CreditStatus {
  return { credits: UNLIMITED_CREDITS, source: 'user', userId, unlimited: true };
}

export async function getCreditsForUser(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return user?.credits ?? 0;
}

export async function getCreditsForGuest(ip: string): Promise<number> {
  const ipHash = hashIp(ip);
  if (!isDbConfigured()) {
    return devGuestCredits.get(ipHash) ?? FREE_CREDITS;
  }
  const row = await prisma.guestUsage.findUnique({ where: { ipHash } });
  if (!row) {
    const created = await prisma.guestUsage.create({ data: { ipHash, credits: FREE_CREDITS } });
    return created.credits;
  }
  return row.credits;
}

export async function resolveCredits(
  userId: string | null,
  ip: string,
  email?: string | null
): Promise<CreditStatus> {
  if (isAdminEmail(email)) {
    return unlimitedStatus(userId ?? undefined);
  }
  if (!isDbConfigured() && !userId) {
    return { credits: await getCreditsForGuest(ip), source: 'guest' };
  }
  if (userId) {
    if (await isAdminUser(userId, email)) {
      return unlimitedStatus(userId);
    }
    if (!isDbConfigured()) {
      return { credits: FREE_CREDITS, source: 'user', userId };
    }
    return { credits: await getCreditsForUser(userId), source: 'user', userId };
  }
  return { credits: await getCreditsForGuest(ip), source: 'guest' };
}

export async function consumeCredit(
  userId: string | null,
  ip: string,
  reason: string,
  email?: string | null
): Promise<{ ok: true; credits: number } | { ok: false; credits: number }> {
  if (isAdminEmail(email) || (userId && (await isAdminUser(userId, email)))) {
    return { ok: true, credits: UNLIMITED_CREDITS };
  }

  if (userId) {
    if (!isDbConfigured()) {
      return { ok: true, credits: FREE_CREDITS };
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits <= 0) {
      return { ok: false, credits: user?.credits ?? 0 };
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });
    await prisma.creditLog.create({
      data: { userId, delta: -1, reason },
    });
    return { ok: true, credits: updated.credits };
  }

  const ipHash = hashIp(ip);
  if (!isDbConfigured()) {
    const current = devGuestCredits.get(ipHash) ?? FREE_CREDITS;
    if (current <= 0) return { ok: false, credits: 0 };
    const next = current - 1;
    devGuestCredits.set(ipHash, next);
    return { ok: true, credits: next };
  }
  const guest = await prisma.guestUsage.findUnique({ where: { ipHash } });
  const current = guest?.credits ?? FREE_CREDITS;
  if (current <= 0) {
    return { ok: false, credits: 0 };
  }
  const updated = await prisma.guestUsage.upsert({
    where: { ipHash },
    create: { ipHash, credits: FREE_CREDITS - 1 },
    update: { credits: { decrement: 1 } },
  });
  await prisma.creditLog.create({
    data: { ipHash, delta: -1, reason },
  });
  return { ok: true, credits: updated.credits };
}

export async function refundCredit(
  userId: string | null,
  ip: string,
  reason: string,
  email?: string | null
): Promise<number> {
  if (isAdminEmail(email) || (userId && (await isAdminUser(userId, email)))) {
    return UNLIMITED_CREDITS;
  }

  if (userId) {
    if (!isDbConfigured()) {
      return FREE_CREDITS;
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 1 } },
    });
    await prisma.creditLog.create({ data: { userId, delta: 1, reason } });
    return updated.credits;
  }
  const ipHash = hashIp(ip);
  if (!isDbConfigured()) {
    const next = (devGuestCredits.get(ipHash) ?? FREE_CREDITS) + 1;
    devGuestCredits.set(ipHash, next);
    return next;
  }
  const updated = await prisma.guestUsage.upsert({
    where: { ipHash },
    create: { ipHash, credits: FREE_CREDITS + 1 },
    update: { credits: { increment: 1 } },
  });
  await prisma.creditLog.create({ data: { ipHash, delta: 1, reason } });
  return updated.credits;
}
