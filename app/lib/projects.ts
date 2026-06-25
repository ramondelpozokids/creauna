import { prisma } from './db';

export interface ProjectSection {
  id: number;
  type: string;
  html: string;
}

export interface ChangeEntry {
  id: number;
  summary: string;
  time: string;
}

export interface StudioMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface ProjectData {
  id: string;
  name: string;
  templateSlug: string | null;
  lang: string;
  sections: ProjectSection[];
  changeLog: ChangeEntry[];
  messages: StudioMessage[];
  status: string;
  updatedAt: string;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function listProjects(userId: string): Promise<ProjectData[]> {
  const rows = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(toProjectData);
}

export async function getProject(userId: string, projectId: string): Promise<ProjectData | null> {
  const row = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });
  return row ? toProjectData(row) : null;
}

export async function createProject(
  userId: string,
  data: {
    name: string;
    templateSlug?: string;
    lang?: string;
    sections: ProjectSection[];
    changeLog?: ChangeEntry[];
    messages?: StudioMessage[];
  }
): Promise<ProjectData> {
  const row = await prisma.project.create({
    data: {
      userId,
      name: data.name,
      templateSlug: data.templateSlug ?? null,
      lang: data.lang ?? 'es',
      sections: JSON.stringify(data.sections),
      changeLog: JSON.stringify(data.changeLog ?? []),
      messages: JSON.stringify(data.messages ?? []),
    },
  });
  return toProjectData(row);
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: Partial<{
    name: string;
    sections: ProjectSection[];
    changeLog: ChangeEntry[];
    messages: StudioMessage[];
    status: string;
  }>
): Promise<ProjectData | null> {
  const existing = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!existing) return null;

  const row = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: data.name,
      sections: data.sections ? JSON.stringify(data.sections) : undefined,
      changeLog: data.changeLog ? JSON.stringify(data.changeLog) : undefined,
      messages: data.messages ? JSON.stringify(data.messages) : undefined,
      status: data.status,
    },
  });
  return toProjectData(row);
}

function toProjectData(row: {
  id: string;
  name: string;
  templateSlug: string | null;
  lang: string;
  sections: string;
  changeLog: string;
  messages: string;
  status: string;
  updatedAt: Date;
}): ProjectData {
  return {
    id: row.id,
    name: row.name,
    templateSlug: row.templateSlug,
    lang: row.lang,
    sections: parseJson<ProjectSection[]>(row.sections, []),
    changeLog: parseJson<ChangeEntry[]>(row.changeLog, []),
    messages: parseJson<StudioMessage[]>(row.messages, []),
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
  };
}
