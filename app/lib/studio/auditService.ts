import { prisma } from '../db';
import { hashIp } from '../auth/users';
import { studioFeatureEnabled } from './contextTypes';

export interface AuditInput {
  projectId?: string;
  userId?: string;
  ip?: string;
  action: string;
  prompt?: string;
  sectionId?: number;
  affectedSectionIds: number[];
  source: string;
  motorsUsed: string[];
  validationOk: boolean;
  validationErrors: string[];
  diffSummary?: string;
  durationMs?: number;
  snapshotId?: string;
}

export async function logProjectChangeAudit(input: AuditInput): Promise<string | null> {
  if (!studioFeatureEnabled('audit')) return null;

  try {
    const row = await prisma.projectChangeAudit.create({
      data: {
        projectId: input.projectId ?? null,
        userId: input.userId ?? null,
        ipHash: input.ip ? hashIp(input.ip) : null,
        action: input.action,
        prompt: input.prompt?.slice(0, 2000) ?? null,
        sectionId: input.sectionId ?? null,
        affectedSectionIds: JSON.stringify(input.affectedSectionIds),
        source: input.source,
        motorsUsed: JSON.stringify(input.motorsUsed),
        validationOk: input.validationOk,
        validationErrors: JSON.stringify(input.validationErrors),
        diffSummary: input.diffSummary?.slice(0, 500) ?? null,
        durationMs: input.durationMs ?? null,
        snapshotId: input.snapshotId ?? null,
      },
    });
    return row.id;
  } catch (err) {
    console.error('audit log (non-fatal):', err);
    return null;
  }
}

export async function listProjectAudits(userId: string, projectId: string, limit = 10) {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) return [];

  const rows = await prisma.projectChangeAudit.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    source: r.source,
    validationOk: r.validationOk,
    diffSummary: r.diffSummary,
    createdAt: r.createdAt.toISOString(),
  }));
}
