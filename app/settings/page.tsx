'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { settingsI18n } from '../data/i18n/secondary';
import { toast } from 'sonner';

export default function Settings() {
  const { lang } = useLanguage();
  const t = settingsI18n[lang];

  const [profile, setProfile] = useState({
    name: lang === 'es' ? 'Ramón del Pozo' : 'Ramón del Pozo',
    email: 'info@ramondelpozorott.es',
    company: 'CREAUNA',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  });

  const notifLabels = {
    email: { label: t.notifEmail, desc: t.notifEmailDesc },
    marketing: { label: t.notifMarketing, desc: t.notifMarketingDesc },
    updates: { label: t.notifUpdates, desc: t.notifUpdatesDesc },
  };

  const handleSave = () => {
    toast.success(t.saved);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="dashboard" />
      <div className="container max-w-3xl py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <div className="space-y-8">
          <div className="bg-white border rounded-3xl p-8">
            <h2 className="font-semibold text-xl mb-6">{t.profile}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2">{t.fullName}</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full border rounded-2xl px-4 py-3" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{t.company}</label>
                <input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="w-full border rounded-2xl px-4 py-3" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium block mb-2">{t.email}</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full border rounded-2xl px-4 py-3" />
              </div>
            </div>
            <button onClick={handleSave} className="mt-8 px-8 py-3 bg-black text-white rounded-2xl font-medium">{t.saveProfile}</button>
          </div>

          <div className="bg-white border rounded-3xl p-8">
            <h2 className="font-semibold text-xl mb-6">{t.notifications}</h2>
            <div className="space-y-4">
              {(Object.keys(notifications) as Array<keyof typeof notifications>).map((key) => (
                <div key={key} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <div className="font-medium">{notifLabels[key].label}</div>
                    <div className="text-sm text-gray-500">{notifLabels[key].desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications[key]} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-3xl p-8">
            <h2 className="font-semibold text-xl mb-2">{t.billing}</h2>
            <p className="text-sm text-gray-600 mb-6">{t.billingText} <span className="font-medium text-blue-600">Pro</span></p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-2 border rounded-2xl text-sm font-medium">{t.manage}</button>
              <button className="px-6 py-2 text-sm text-red-600 hover:bg-red-50 rounded-2xl">{t.cancel}</button>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center">{t.demoNote}</div>
        </div>
      </div>
    </div>
  );
}
