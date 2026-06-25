'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';

type Lang = 'es' | 'en';

export type SectorPublic = {
  id: string;
  label: string;
  group: string;
  templateSlug: string;
  tier: 'priority' | 'standard' | 'extended';
  promptHint?: string;
};

type Props = {
  lang: Lang;
  selectedId?: string | null;
  onSelect: (sector: SectorPublic) => void;
  compact?: boolean;
};

const copy = {
  es: {
    title: 'Biblioteca de sectores',
    subtitle: 'Elige tu sector. Los agentes IA crearán la web con la estructura y tono correctos.',
    priority: '15 sectores prioritarios',
    extended: 'Más sectores',
    search: 'Buscar sector…',
    selected: 'Sector activo',
    empty: 'No hay resultados',
    loading: 'Cargando biblioteca…',
    agents: 'Los 4 motores IA seguirán el playbook de este sector',
  },
  en: {
    title: 'Sector library',
    subtitle: 'Pick your industry. AI agents will build the site with the right structure and tone.',
    priority: '15 priority sectors',
    extended: 'More sectors',
    search: 'Search sector…',
    selected: 'Active sector',
    empty: 'No results',
    loading: 'Loading library…',
    agents: 'All 4 AI engines follow this sector playbook',
  },
} as const;

export default function StudioSectorLibrary({ lang, selectedId, onSelect, compact }: Props) {
  const t = copy[lang];
  const [sectors, setSectors] = useState<SectorPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showExtended, setShowExtended] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/studio/sectors?lang=${lang}&tier=all`)
      .then((r) => r.json())
      .then((data: { sectors?: SectorPublic[] }) => {
        if (!cancelled) setSectors(data.sectors ?? []);
      })
      .catch(() => {
        if (!cancelled) setSectors([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sectors;
    return sectors.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q) ||
        s.id.includes(q)
    );
  }, [sectors, query]);

  const priority = filtered.filter((s) => s.tier === 'priority');
  const extended = filtered.filter((s) => s.tier !== 'priority');

  const selected = sectors.find((s) => s.id === selectedId);

  const renderGrid = (items: SectorPublic[]) => (
    <div className={`grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
      {items.map((sector) => {
        const active = sector.id === selectedId;
        return (
          <button
            key={sector.id}
            type="button"
            onClick={() => onSelect(sector)}
            className={`text-left rounded-2xl border-2 p-3 transition-all cursor-pointer ${
              active
                ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase truncate">{sector.group}</div>
            <div className="font-semibold text-sm text-slate-900 mt-0.5 leading-snug">{sector.label}</div>
            <div className="text-[10px] text-indigo-600 mt-1 font-medium">{sector.templateSlug}</div>
          </button>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[280px] p-8 text-slate-400 text-sm">
        <Sparkles className="w-6 h-6 animate-pulse mb-2 text-indigo-400" />
        {t.loading}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${compact ? 'p-4' : 'p-6 md:p-10'} overflow-auto max-h-full`}>
      <div className="flex items-start gap-3 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">{t.title}</h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{t.subtitle}</p>
        </div>
      </div>

      {selected && (
        <div className="mb-4 rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 shrink-0">
          <div className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">{t.selected}</div>
          <div className="font-semibold text-slate-900">{selected.label}</div>
          <p className="text-xs text-indigo-700/80 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 shrink-0" /> {t.agents}
          </p>
        </div>
      )}

      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">{t.empty}</p>
      ) : (
        <div className="space-y-5 pb-4">
          {priority.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">{t.priority}</h3>
              {renderGrid(priority)}
            </section>
          )}

          {extended.length > 0 && (
            <section>
              <button
                type="button"
                onClick={() => setShowExtended((v) => !v)}
                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 hover:text-indigo-600 cursor-pointer"
              >
                {t.extended} ({extended.length})
                {showExtended ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {(showExtended || query.trim()) && renderGrid(extended)}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
