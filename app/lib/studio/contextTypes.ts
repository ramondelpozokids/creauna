import type { ChangeEntry, ProjectSection } from '../projects';

export interface StudioChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export type StudioLang = 'es' | 'en';

export type ImpactScope = 'single' | 'multi' | 'full';
export type ImpactRisk = 'low' | 'medium' | 'high';

export interface SectionMeta {
  id: number;
  type: string;
}

export interface ImpactInput {
  prompt: string;
  lang: StudioLang;
  action: string;
  sectionId?: number;
  previewSections: SectionMeta[];
}

export interface ImpactResult {
  scope: ImpactScope;
  affectedSectionIds: number[];
  affectedSectionTypes: string[];
  risk: ImpactRisk;
  willConsumeCredit: boolean;
  reasonEs: string;
  reasonEn: string;
  warnings: { es: string; en: string }[];
}

export interface SnapshotData {
  id: string;
  projectId: string;
  versionNumber: number;
  sections: ProjectSection[];
  changeLog: ChangeEntry[];
  action: string;
  prompt: string | null;
  sectionId: number | null;
  label: string | null;
  createdAt: string;
}

export function studioFeatureEnabled(flag: 'snapshots' | 'impact' | 'validation' | 'audit'): boolean {
  if (flag === 'snapshots') {
    return process.env.CREAUNA_STUDIO_SNAPSHOTS !== 'false';
  }
  if (flag === 'impact') {
    return process.env.CREAUNA_STUDIO_IMPACT_PREVIEW !== 'false';
  }
  if (flag === 'validation') {
    return process.env.CREAUNA_STUDIO_VALIDATION !== 'false';
  }
  return process.env.CREAUNA_STUDIO_AUDIT !== 'false';
}
