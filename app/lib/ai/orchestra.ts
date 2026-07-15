import type { DirectorPlan, DirectorStrategy } from '../studio/studioDirector';
import { MOTOR_PROVIDER, type MotorId, type AiProvider } from './providers';

/** Instrumento por tipo de sección cuando el director convoca a toda la orquesta. */
export const SECTION_MOTOR: Record<string, MotorId> = {
  hero: 'visual',
  gallery: 'visual',
  about: 'copy',
  reviews: 'copy',
  blog: 'copy',
  menu: 'code',
  services: 'code',
  carta: 'code',
  reservation: 'ux',
  location: 'ux',
  contact: 'ux',
  footer: 'code',
};

export interface OrchestraAssignment {
  sectionType: string;
  motor: MotorId;
  provider: AiProvider;
}

export interface OrchestraManifest {
  conductor: 'creauna_director';
  strategy: DirectorStrategy;
  assignments: OrchestraAssignment[];
  motorsUsed: MotorId[];
  providersUsed: AiProvider[];
}

/** Instrumentos del Motor Visual: layout (Gemini) + imágenes (fal.ai). */
export const VISUAL_ORCHESTRA = {
  layout: 'gemini' as AiProvider,
  images: 'fal' as AiProvider,
};

const STRATEGY_MOTOR: Partial<Record<DirectorStrategy, MotorId>> = {
  visual: 'visual',
  copy: 'copy',
  ux: 'ux',
  code: 'code',
};

/** El director asigna qué motor (IA) toca cada sección según la estrategia. */
export function resolveMotorForSection(sectionType: string, plan: DirectorPlan): MotorId {
  const solo = STRATEGY_MOTOR[plan.strategy];
  if (solo) return solo;
  return SECTION_MOTOR[sectionType] ?? 'visual';
}

export function buildOrchestraManifest(plan: DirectorPlan, targetTypes: string[]): OrchestraManifest {
  const assignments: OrchestraAssignment[] = targetTypes.map((sectionType) => {
    const motor = resolveMotorForSection(sectionType, plan);
    return {
      sectionType,
      motor,
      provider: MOTOR_PROVIDER[motor],
    };
  });

  const motorsUsed = [...new Set(assignments.map((a) => a.motor))];
  const providersUsed = [...new Set(assignments.map((a) => a.provider))];

  return {
    conductor: 'creauna_director',
    strategy: plan.strategy,
    assignments,
    motorsUsed,
    providersUsed,
  };
}

export function orchestraSummary(manifest: OrchestraManifest, lang: 'es' | 'en'): string {
  const parts = manifest.assignments.map((a) => `${a.sectionType}→${a.motor}`);
  if (lang === 'es') {
    return `Director CREAUNA (${manifest.strategy}): ${parts.join(', ')}`;
  }
  return `CREAUNA Director (${manifest.strategy}): ${parts.join(', ')}`;
}

export function motorLabel(motor: MotorId, lang: 'es' | 'en'): string {
  const labels: Record<MotorId, { es: string; en: string }> = {
    visual: { es: 'Motor Visual', en: 'Visual engine' },
    copy: { es: 'Motor Copy', en: 'Copy engine' },
    code: { es: 'Motor Código', en: 'Code engine' },
    ux: { es: 'Motor UX', en: 'UX engine' },
  };
  return labels[motor][lang];
}
