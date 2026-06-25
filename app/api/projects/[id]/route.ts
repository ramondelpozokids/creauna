import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/auth/session';
import { getProject, updateProject } from '../../../lib/projects';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const project = await getProject(session.id, id);
  if (!project) {
    return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`projects-update:${ip}`, 60, 60_000);
  if (limited) return limited;

  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const project = await updateProject(session.id, id, {
      name: body.name ? sanitizeText(body.name, 120) : undefined,
      sections: Array.isArray(body.sections) ? body.sections : undefined,
      changeLog: Array.isArray(body.changeLog) ? body.changeLog : undefined,
      messages: Array.isArray(body.messages) ? body.messages : undefined,
      status: body.status ? sanitizeText(body.status, 40) : undefined,
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('api/projects PATCH:', error);
    return NextResponse.json({ error: 'Error al guardar proyecto' }, { status: 500 });
  }
}
