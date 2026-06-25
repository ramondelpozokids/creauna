import { prisma } from '../db';
import type { ChangeEntry, ProjectSection } from '../projects';
import type { SnapshotData } from './contextTypes';

const MAX_SNAPSHOTS_PER_PROJECT = 30;

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toSnapshotData(row: {
  id: string;
  projectId: string;
  versionNumber: number;
  sections: string;
  changeLog: string;
  action: string;
  prompt: string | null;
  sectionId: number | null;
  label: string | null;
  createdAt: Date;
}): SnapshotData {
  return {
    id: row.id,
    projectId: row.projectId,
    versionNumber: row.versionNumber,
    sections: parseJson<ProjectSection[]>(row.sections, []),
    changeLog: parseJson<ChangeEntry[]>(row.changeLog, []),
    action: row.action,
    prompt: row.prompt,
    sectionId: row.sectionId,
    label: row.label,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listProjectSnapshots(userId: string, projectId: string): Promise<SnapshotData[]> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) return [];

  const rows = await prisma.projectSnapshot.findMany({
    where: { projectId },
    orderBy: { versionNumber: 'desc' },
    take: MAX_SNAPSHOTS_PER_PROJECT,
  });
  return rows.map(toSnapshotData);
}

export async function createProjectSnapshot(
  userId: string,
  projectId: string,
  data: {
    sections: ProjectSection[];
    changeLog: ChangeEntry[];
    action: string;
    prompt?: string;
    sectionId?: number;
    label?: string;
  }
): Promise<SnapshotData | null> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) return null;

  const latest = await prisma.projectSnapshot.findFirst({
    where: { projectId },
    orderBy: { versionNumber: 'desc' },
    select: { versionNumber: true },
  });
  const versionNumber = (latest?.versionNumber ?? 0) + 1;

  const row = await prisma.projectSnapshot.create({
    data: {
      projectId,
      userId,
      versionNumber,
      sections: JSON.stringify(data.sections),
      changeLog: JSON.stringify(data.changeLog),
      action: data.action,
      prompt: data.prompt ?? null,
      sectionId: data.sectionId ?? null,
      label: data.label ?? null,
    },
  });

  const overflow = await prisma.projectSnapshot.findMany({
    where: { projectId },
    orderBy: { versionNumber: 'desc' },
    skip: MAX_SNAPSHOTS_PER_PROJECT,
    select: { id: true },
  });
  if (overflow.length > 0) {
    await prisma.projectSnapshot.deleteMany({
      where: { id: { in: overflow.map((o) => o.id) } },
    });
  }

  return toSnapshotData(row);
}

export async function restoreProjectSnapshot(
  userId: string,
  projectId: string,
  snapshotId: string
): Promise<{ project: { sections: ProjectSection[]; changeLog: ChangeEntry[] }; snapshot: SnapshotData } | null> {
  const snapshot = await prisma.projectSnapshot.findFirst({
    where: { id: snapshotId, projectId, userId },
  });
  if (!snapshot) return null;

  const sections = parseJson<ProjectSection[]>(snapshot.sections, []);
  const changeLog = parseJson<ChangeEntry[]>(snapshot.changeLog, []);

  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) return null;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      sections: JSON.stringify(sections),
      changeLog: JSON.stringify(changeLog),
    },
  });

  return {
    project: { sections, changeLog },
    snapshot: toSnapshotData(snapshot),
  };
}
