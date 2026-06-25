import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth/session';
import { listProjectAudits } from '../../../../lib/studio/auditService';
import { studioFeatureEnabled } from '../../../../lib/studio/contextTypes';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  if (!studioFeatureEnabled('audit')) {
    return NextResponse.json({ audits: [], disabled: true });
  }

  const { id } = await ctx.params;
  const audits = await listProjectAudits(session.id, id);
  return NextResponse.json({ audits });
}
