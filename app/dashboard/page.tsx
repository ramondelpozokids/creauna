'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageProvider';
import { dashboardI18n } from '../data/i18n/secondary';
import { Sparkles, Plus, Globe, Coins, Edit3, LogOut } from 'lucide-react';

interface ProjectRow {
  id: string;
  name: string;
  status: string;
  templateSlug: string | null;
  updatedAt: string;
}

interface MeUser {
  name: string;
  email: string;
  credits: number;
  role: string;
}

export default function Dashboard() {
  const { lang } = useLanguage();
  const d = dashboardI18n[lang];
  const [user, setUser] = useState<MeUser | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/projects').then((r) => (r.ok ? r.json() : { projects: [] })),
    ])
      .then(([me, proj]) => {
        if (me.authenticated) setUser(me.user);
        setProjects(proj.projects ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight">CREAUNA</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/studio" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100">
              <Sparkles className="w-4 h-4" /> Studio
            </Link>
            <Link href="/templates" className="px-4 py-2 rounded-xl hover:bg-slate-100">
              {lang === 'es' ? 'Plantillas' : 'Templates'}
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer">
              <LogOut className="w-4 h-4" /> {lang === 'es' ? 'Salir' : 'Log out'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-slate-500">{lang === 'es' ? 'Cargando…' : 'Loading…'}</p>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-slate-400">{d.welcome}</p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 mt-1">
                {user?.name ?? (lang === 'es' ? 'Usuario' : 'User')}
              </h1>
              <p className="text-slate-600 mt-2 max-w-xl">{d.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Coins className="w-4 h-4" /> {d.credits}
                </div>
                <div className="text-3xl font-semibold mt-2">{user?.credits ?? 0}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Globe className="w-4 h-4" /> {d.projects}
                </div>
                <div className="text-3xl font-semibold mt-2">{projects.length}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-center">
                <Link
                  href="/studio"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> {d.newProject}
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-lg">{d.projects}</h2>
                <Link href="/studio" className="text-sm text-indigo-600 font-medium">{d.openStudio}</Link>
              </div>
              {projects.length === 0 ? (
                <div className="p-10 text-center text-slate-500">{d.noProjects}</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {projects.map((p) => (
                    <li key={p.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                      <div>
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {p.status} · {formatDate(p.updatedAt)}
                          {p.templateSlug ? ` · ${p.templateSlug}` : ''}
                        </div>
                      </div>
                      <Link
                        href={`/studio?project=${p.id}`}
                        className="flex items-center gap-2 text-sm px-4 py-2 border border-slate-200 rounded-xl hover:bg-white"
                      >
                        <Edit3 className="w-4 h-4" /> {lang === 'es' ? 'Editar' : 'Edit'}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-center text-xs text-slate-400 mt-8">{d.secure}</p>
          </>
        )}
      </div>
    </div>
  );
}
