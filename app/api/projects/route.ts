import { NextResponse } from 'next/server';
import { getSessionUser } from '../../lib/auth/session';
import { createProject, listProjects } from '../../lib/projects';
import { applyRateLimit, getClientIp } from '../../lib/api/rateLimit';
import { sanitizeText } from '../../lib/api/validate';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  const projects = await listProjects(session.id);
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`projects:${ip}`, 20, 60_000);
  if (limited) return limited;

  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = sanitizeText(body.name, 120) || 'Mi proyecto';
    const templateSlug = sanitizeText(body.templateSlug, 80) || undefined;
    const lang = body.lang === 'en' ? 'en' : 'es';
    const sections = Array.isArray(body.sections) ? body.sections : [];
    const changeLog = Array.isArray(body.changeLog) ? body.changeLog : [];

    const project = await createProject(session.id, {
      name,
      templateSlug,
      lang,
      sections,
      changeLog,
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('api/projects POST:', error);
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}
