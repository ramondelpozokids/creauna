'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { superadminI18n } from '../data/i18n/legal';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export default function SuperAdmin() {
  const { lang } = useLanguage();
  const t = superadminI18n[lang];
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          window.location.href = '/login?next=/superadmin';
          return;
        }
        if (data.user?.role !== 'admin') {
          setForbidden(true);
          return;
        }
        setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-slate-400">{t.loading}</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-slate-900">{t.forbiddenTitle}</h1>
          <p className="text-slate-600 mt-3">{t.forbiddenText}</p>
          <Link href="/dashboard" className="inline-block mt-6 text-indigo-600 font-medium">{t.backDashboard}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-2xl">CREAUNA</div>
            <div className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full">{t.badge}</div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 hidden sm:inline">{user?.email}</span>
            <Link href="/" className="text-slate-600 hover:text-slate-900">{t.exit}</Link>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-slate-600 mt-2">{t.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="premium-card p-6">
            <div className="text-sm text-slate-500 uppercase tracking-wider">{t.panelOps}</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• {t.itemUsers}</li>
              <li>• {t.itemProjects}</li>
              <li>• {t.itemCredits}</li>
              <li>• {t.itemAi}</li>
            </ul>
          </div>
          <div className="premium-card p-6 md:col-span-2">
            <div className="text-sm text-slate-500 uppercase tracking-wider">{t.panelStatus}</div>
            <p className="mt-4 text-slate-700 leading-relaxed">{t.statusText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/studio" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm">{t.openStudio}</Link>
              <Link href="/templates" className="px-4 py-2 border border-slate-200 rounded-xl text-sm">{t.openTemplates}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
