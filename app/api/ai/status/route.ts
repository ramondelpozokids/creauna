import { getConfiguredProviders, isProviderConfigured, MOTOR_PROVIDER } from '../../../lib/ai/providers';

export async function GET() {
  return Response.json({
    motors: {
      visual: { provider: MOTOR_PROVIDER.visual, configured: isProviderConfigured(MOTOR_PROVIDER.visual) },
      copy: { provider: MOTOR_PROVIDER.copy, configured: isProviderConfigured(MOTOR_PROVIDER.copy) },
      code: { provider: MOTOR_PROVIDER.code, configured: isProviderConfigured(MOTOR_PROVIDER.code) },
      ux: { provider: MOTOR_PROVIDER.ux, configured: isProviderConfigured(MOTOR_PROVIDER.ux) },
    },
    configured: getConfiguredProviders(),
    arena: {
      available: false,
      note: 'LMSYS/Arena no ofrece API oficial con claves. No recomendado para producción.',
    },
    manus: {
      configured: isProviderConfigured('manus'),
      note: 'Manus es agente async para tareas complejas, no para preview instantáneo del Studio.',
    },
  });
}
