'use client';

import { useCallback, useState } from 'react';

type PingRow = {
  provider: string;
  label: string;
  status: 'ok' | 'missing' | 'error';
  model: string | null;
  latencyMs: number | null;
  sample: string | null;
  error: string | null;
  bestFor: string[];
  motors: string[];
};

type PingPayload = {
  summary: {
    ok: number;
    errors: number;
    missing: number;
    allMotorsReady: boolean;
    working: string[];
    motorHealth: { motor: string; provider: string; ready: boolean; status: string }[];
  };
  providers: PingRow[];
  durationMs: number;
};

const statusClass: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  error: 'bg-red-100 text-red-800',
  missing: 'bg-slate-100 text-slate-600',
};

export default function AiHealthPanel() {
  const [data, setData] = useState<PingPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/ping');
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Error al comprobar APIs');
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError('No se pudo conectar con /api/ai/ping');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="premium-card p-6 md:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500 uppercase tracking-wider">Director de IAs · ping en vivo</div>
          <p className="mt-2 text-sm text-slate-600">
            Comprueba Gemini, Claude, OpenAI, Groq y Manus con una llamada real a cada API.
          </p>
        </div>
        <button
          type="button"
          onClick={runPing}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Comprobando…' : 'Ejecutar ping'}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {data && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">{data.summary.ok} OK</span>
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">{data.summary.errors} error</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">{data.summary.missing} sin key</span>
            <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">{data.durationMs} ms total</span>
            {data.summary.allMotorsReady ? (
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">Motores Studio listos</span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800">Algún motor sin proveedor OK</span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-3">Proveedor</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3">Modelo</th>
                  <th className="py-2 pr-3">Latencia</th>
                  <th className="py-2 pr-3">Motores</th>
                  <th className="py-2">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {data.providers.map((row) => (
                  <tr key={row.provider} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-3 font-medium">{row.label}</td>
                    <td className="py-3 pr-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{row.model || '—'}</td>
                    <td className="py-3 pr-3 text-slate-600">{row.latencyMs != null ? `${row.latencyMs} ms` : '—'}</td>
                    <td className="py-3 pr-3 text-slate-600">{row.motors.length ? row.motors.join(', ') : 'async'}</td>
                    <td className="py-3 text-slate-600">
                      {row.error || row.sample || row.bestFor.slice(0, 2).join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
