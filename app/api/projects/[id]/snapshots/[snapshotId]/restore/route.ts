import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../../../lib/auth/session';
import { applyRateLimit, getClientIp } from '../../../../../../lib/api/rateLimit';
import { restoreProjectSnapshot } from '../../../../../../lib/studio/snapshotService';
import { studioFeatureEnabled } from '../../../../../../lib/studio/contextTypes';

export async function POST(_req: Request, ctx: { params: Promise<{ id: string; snapshotId: string }> }) {
  const ip = getClientIp(_req);
  const limited = applyRateLimit(`snapshots-restore:${ip}`, 30, 60_000);
  if (limited) return limited;

  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  if (!studioFeatureEnabled('snapshots')) {
    return NextResponse.json({ error: 'Snapshots desactivados' }, { status: 503 });
  }

  try {
    const { id, snapshotId } = await ctx.params;
    const result = await restoreProjectSnapshot(session.id, id, snapshotId);
    if (!result) {
      return NextResponse.json({ error: 'Snapshot no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      sections: result.project.sections,
      changeLog: result.project.changeLog,
      restoredVersion: result.snapshot.versionNumber,
    });
  } catch (error) {
    console.error('api/projects/snapshots/restore:', error);
    return NextResponse.json({ error: 'Error al restaurar' }, { status: 500 });
  }
}
