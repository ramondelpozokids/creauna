import { prisma } from './db';
import { FREE_CREDITS, hashIp } from './auth/users';

export interface CreditStatus {
  credits: number;
  source: 'user' | 'guest';
  userId?: string;
}

export async function getCreditsForUser(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return user?.credits ?? 0;
}

export async function getCreditsForGuest(ip: string): Promise<number> {
  const ipHash = hashIp(ip);
  const row = await prisma.guestUsage.findUnique({ where: { ipHash } });
  if (!row) {
    const created = await prisma.guestUsage.create({ data: { ipHash, credits: FREE_CREDITS } });
    return created.credits;
  }
  return row.credits;
}

export async function resolveCredits(userId: string | null, ip: string): Promise<CreditStatus> {
  if (userId) {
    return { credits: await getCreditsForUser(userId), source: 'user', userId };
  }
  return { credits: await getCreditsForGuest(ip), source: 'guest' };
}

export async function consumeCredit(userId: string | null, ip: string, reason: string): Promise<{ ok: true; credits: number } | { ok: false; credits: number }> {
  if (userId) {
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

export async function refundCredit(userId: string | null, ip: string, reason: string): Promise<number> {
  if (userId) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 1 } },
    });
    await prisma.creditLog.create({ data: { userId, delta: 1, reason } });
    return updated.credits;
  }
  const ipHash = hashIp(ip);
  const updated = await prisma.guestUsage.upsert({
    where: { ipHash },
    create: { ipHash, credits: FREE_CREDITS + 1 },
    update: { credits: { increment: 1 } },
  });
  await prisma.creditLog.create({ data: { ipHash, delta: 1, reason } });
  return updated.credits;
}
