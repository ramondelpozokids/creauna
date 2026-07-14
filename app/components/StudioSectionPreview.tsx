'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Zap } from 'lucide-react';
import { CUA_SITE_RESPONSIVE_CSS, buildMobilePreviewDocument } from '../lib/ai/responsiveSiteCss';
import { wrapSectionHtml } from '../lib/ai/siteSectionWrap';

export type PreviewSection = { id: number; type: string; html: string };

type Props = {
  sections: PreviewSection[];
  viewMode: 'desktop' | 'mobile';
  lang: 'es' | 'en';
  selectedSectionId: number | null;
  highlightedIds: number[];
  isThinking: boolean;
  improveLabel: string;
  sectionRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  onSelectSection: (id: number) => void;
  onImproveSection: (id: number) => void;
};

function FullPagePreview({
  html,
  viewMode,
  lang,
  isThinking,
}: {
  html: string;
  viewMode: 'desktop' | 'mobile';
  lang: 'es' | 'en';
  isThinking: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const srcDoc = useMemo(() => html, [html]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resize = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      const height = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight, 720);
      iframe.style.height = `${height + 16}px`;
    };

    iframe.addEventListener('load', resize);
    const t = window.setTimeout(resize, 200);
    const interval = window.setInterval(resize, 1500);
    return () => {
      iframe.removeEventListener('load', resize);
      window.clearTimeout(t);
      window.clearInterval(interval);
    };
  }, [srcDoc]);

  return (
    <iframe
      ref={iframeRef}
      title={lang === 'es' ? 'Muestra premium' : 'Premium sample'}
      srcDoc={srcDoc}
      className={`w-full border-0 bg-white min-h-[720px] ${
        viewMode === 'mobile' ? 'max-w-[390px] mx-auto shadow-xl rounded-[2rem]' : ''
      } ${isThinking ? 'opacity-95' : ''}`}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

export default function StudioSectionPreview({
  sections,
  viewMode,
  lang,
  selectedSectionId,
  highlightedIds,
  isThinking,
  improveLabel,
  sectionRefs,
  onSelectSection,
  onImproveSection,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fullPage = sections.find((s) => s.type === 'fullpage');

  const mobileSrcDoc = useMemo(() => {
    const body = sections
      .map(
        (section) =>
          `<section data-id="${section.id}">${wrapSectionHtml(section.html)}</section>`
      )
      .join('');
    return buildMobilePreviewDocument(body, lang);
  }, [sections, lang]);

  useEffect(() => {
    if (fullPage || viewMode !== 'mobile') return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resize = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      iframe.style.height = `${Math.max(doc.body.scrollHeight + 16, 480)}px`;
    };

    iframe.addEventListener('load', resize);
    const t = window.setTimeout(resize, 120);
    return () => {
      iframe.removeEventListener('load', resize);
      window.clearTimeout(t);
    };
  }, [viewMode, mobileSrcDoc, fullPage]);

  if (fullPage) {
    return (
      <div className="bg-slate-100 p-4 md:p-6 min-h-full">
        <FullPagePreview html={fullPage.html} viewMode={viewMode} lang={lang} isThinking={isThinking} />
      </div>
    );
  }

  if (viewMode === 'mobile') {
    return (
      <iframe
        ref={iframeRef}
        title={lang === 'es' ? 'Vista móvil' : 'Mobile view'}
        srcDoc={mobileSrcDoc}
        className={`w-full border-0 bg-white min-h-[480px] ${isThinking ? 'opacity-95' : ''}`}
        sandbox="allow-scripts allow-same-origin"
      />
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: CUA_SITE_RESPONSIVE_CSS }} />
      <div
        className="p-6 md:p-10 space-y-8 bg-white @container"
        style={{ containerType: 'inline-size', containerName: 'cua-preview' }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            onClick={() => onSelectSection(section.id)}
            className={`group relative rounded-2xl transition-all duration-500 cursor-pointer ${
              selectedSectionId === section.id ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
            } ${highlightedIds.includes(section.id) ? 'ring-4 ring-emerald-400 ring-offset-4 scale-[1.01]' : ''}`}
          >
            <div dangerouslySetInnerHTML={{ __html: wrapSectionHtml(section.html) }} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImproveSection(section.id);
              }}
              className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 cursor-pointer z-10"
            >
              <Zap className="w-3 h-3" /> {improveLabel}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
