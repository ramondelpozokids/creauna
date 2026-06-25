import { NextResponse } from 'next/server';
import { getSessionUser } from '../../lib/auth/session';
import { resolveCredits } from '../../lib/credits';
import { getClientIp } from '../../lib/api/rateLimit';

export async function GET(req: Request) {
  const session = await getSessionUser();
  const ip = getClientIp(req);
  const status = await resolveCredits(session?.id ?? null, ip, session?.email);
  return NextResponse.json(status);
}
