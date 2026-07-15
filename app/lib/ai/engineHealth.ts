import { getConfiguredProviders, MOTOR_PROVIDER, isProviderConfigured, type AiProvider, type MotorId } from './providers';
import { VISUAL_ORCHESTRA } from './orchestra';

export type AiSkippedReason =
  | 'no_api_keys'
  | 'ai_parse_failed'
  | 'no_targets'
  | 'premium_locked'
  | 'validation_failed'
  | 'no_meaningful_diff';

export type PipelineStage =
  | 'discovery_initial'
  | 'full_site_generate'
  | 'premium_personalize'
  | 'rules'
  | 'director'
  | 'ai_section'
  | 'fal_visual'
  | 'rules_fallback'
  | 'rules_only'
  | 'prompt_first';

export interface EngineHealthStatus {
  ready: boolean;
  aiEnabled: boolean;
  orchestraReady: boolean;
  configuredProviders: AiProvider[];
  missingMotors: MotorId[];
  motorProviders: Record<MotorId, AiProvider>;
  orchestra: Record<MotorId, { provider: AiProvider; configured: boolean }>;
  visualOrchestra: { layout: AiProvider; images: AiProvider; imagesReady: boolean };
  warnings: string[];
}

/** Estado operativo del motor — útil para diagnóstico y /api/ai/status. */
export function getEngineHealth(): EngineHealthStatus {
  const configured = getConfiguredProviders().filter(
    (p): p is AiProvider => p !== 'manus' && p !== 'fal'
  );
  const missingMotors = (Object.entries(MOTOR_PROVIDER) as [MotorId, AiProvider][])
    .filter(([, provider]) => !isProviderConfigured(provider))
    .map(([motor]) => motor);

  const orchestra = Object.fromEntries(
    (Object.entries(MOTOR_PROVIDER) as [MotorId, AiProvider][]).map(([motor, provider]) => [
      motor,
      { provider, configured: isProviderConfigured(provider) },
    ])
  ) as EngineHealthStatus['orchestra'];

  const warnings: string[] = [];
  if (configured.length === 0) {
    warnings.push(
      'Sin claves IA (GEMINI/ANTHROPIC/OPENAI/GROQ): el motor genera con reglas pero sin refinamiento IA.'
    );
  } else if (missingMotors.length > 0) {
    warnings.push(`Instrumentos sin clave: ${missingMotors.join(', ')} (fallback a otro proveedor).`);
  }

  return {
    ready: true,
    aiEnabled: configured.length > 0,
    orchestraReady: missingMotors.length === 0,
    configuredProviders: configured,
    missingMotors,
    motorProviders: MOTOR_PROVIDER,
    orchestra,
    visualOrchestra: {
      layout: VISUAL_ORCHESTRA.layout,
      images: VISUAL_ORCHESTRA.images,
      imagesReady: isProviderConfigured('fal'),
    },
    warnings,
  };
}
