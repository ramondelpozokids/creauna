'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import TemplateDemoPreviewFrame from '../../../components/TemplateDemoPreviewFrame';
import { useLanguage } from '../../../components/LanguageProvider';
import { getTemplateShowcaseBySlug } from '../../../data/templateShowcase';

export default function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useLanguage();
  const item = getTemplateShowcaseBySlug(slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container pt-32 text-center">
          <h1 className="text-2xl font-bold">
            {lang === 'es' ? 'Plantilla no encontrada' : 'Template not found'}
          </h1>
          <Link href="/templates" className="text-indigo-600 mt-4 inline-block">
            {lang === 'es' ? '← Volver al catálogo' : '← Back to catalog'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex flex-col min-h-0">
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0">
          <Link href="/templates" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'es' ? 'Plantillas' : 'Templates'}
          </Link>
        </div>
        <div className="flex-1 min-h-0">
          <TemplateDemoPreviewFrame item={item} lang={lang} fullscreen={false} showActions />
        </div>
      </div>
    </div>
  );
}
