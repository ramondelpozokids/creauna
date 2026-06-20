'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../components/LanguageProvider';
import { authI18n } from '../data/i18n/marketing';
import { toast } from 'sonner';

export default function Login() {
  const { lang } = useLanguage();
  const t = authI18n[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.loginError);
      toast.success(t.welcomeBack);
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <img src="/images/logo.png" alt="CREAUNA" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-3xl tracking-tight text-slate-900">CREAUNA</span>
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">{t.loginTitle}</h1>
          <p className="text-slate-600 mb-8">{t.loginSubtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-1.5">{t.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="tu@empresa.com" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">{t.password}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-slate-900" /> {t.remember}
              </label>
              <Link href="#" className="text-slate-600 hover:underline">{t.forgot}</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-medium disabled:opacity-70 mt-2">
              {loading ? t.loggingIn : t.loginBtn}
            </button>
          </form>
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">{t.or}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <button className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50">
            {t.google}
          </button>
          <p className="mt-8 text-center text-sm">
            {t.noAccount}{' '}
            <Link href="/signup" className="font-medium text-slate-900 hover:underline">{t.createFree}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
