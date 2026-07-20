/**
 * Constrained Renderer — HTML bajo contrato DNA + composition.
 * Techo visual: asimetría, ritmo, brand-first, sin Lego uniforme.
 */

import type { CreativeBrief } from './creativeBrief';
import type { DesignDna } from './designDna';
import type { CompositionSelection } from './compositionEngine';
import { IMAGE_BANK, type ImageBankCategory } from '../imageBank';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function packUrls(key: string): { hero: string; gallery: string[]; about: string } {
  const bank =
    (IMAGE_BANK as Record<string, Record<string, unknown>>)[key] ||
    (IMAGE_BANK.default as unknown as Record<string, unknown>);
  const hero = typeof bank.hero === 'string' ? bank.hero : IMAGE_BANK.default.hero;
  const gallery = Array.isArray(bank.gallery)
    ? (bank.gallery as string[]).slice(0, 9)
    : ([...IMAGE_BANK.default.gallery] as string[]);
  const about = typeof bank.about === 'string' ? (bank.about as string) : gallery[0] || hero;
  return { hero, gallery, about };
}

function radiusCss(r: DesignDna['radius']): string {
  if (r === 'sharp') return '0';
  if (r === 'pill') return '999px';
  return '14px';
}

function seedBit(seed: string, i: number): number {
  return seed.charCodeAt(i % seed.length) || 1;
}

function h1Size(dna: DesignDna): string {
  if (dna.typography.scale === 'billboard') return 'clamp(2.9rem, 8vw, 5.4rem)';
  if (dna.typography.scale === 'intimate') return 'clamp(2.05rem, 4.2vw, 3.1rem)';
  return 'clamp(2.35rem, 5.8vw, 4.2rem)';
}

function bleedOverlay(sector: string): string {
  if (sector === 'clinic') return 'linear-gradient(105deg,rgba(247,251,252,.92) 0%,rgba(247,251,252,.55) 42%,rgba(26,43,60,.35) 100%)';
  if (sector === 'hotel') return 'linear-gradient(180deg,rgba(26,24,20,.25) 0%,rgba(26,24,20,.55) 55%,rgba(26,24,20,.72) 100%)';
  if (sector === 'legal') return 'linear-gradient(90deg,rgba(244,242,238,.94) 0%,rgba(244,242,238,.7) 48%,rgba(18,20,26,.4) 100%)';
  if (sector === 'architecture') return 'linear-gradient(180deg,rgba(255,255,255,.15) 0%,rgba(13,13,13,.55) 100%)';
  if (sector === 'restaurant' || sector === 'cafe')
    return 'linear-gradient(180deg,rgba(28,20,16,.2) 0%,rgba(28,20,16,.62) 100%)';
  if (sector === 'barber') return 'linear-gradient(180deg,rgba(15,15,15,.35) 0%,rgba(15,15,15,.78) 100%)';
  return 'linear-gradient(180deg,rgba(0,0,0,.28) 0%,rgba(0,0,0,.58) 100%)';
}

function secondaryHref(brief: CreativeBrief, sel: CompositionSelection): string {
  const order = sel.sectionOrder.join(' ');
  if (/menu|carta|service|practice|product|room|treatment/i.test(order)) return '#servicios';
  if (/galer|gallery|project|lookbook/i.test(order)) return '#galeria';
  return '#nosotros';
}

function ctaRow(brief: CreativeBrief, sel: CompositionSelection, onDark = false): string {
  const ghost = onDark ? 'cua-btn-on-dark' : 'cua-btn-ghost';
  return `<div class="cua-cta-row">
    <a href="#contacto" class="cua-btn-primary">${esc(brief.primaryCta)}</a>
    <a href="${secondaryHref(brief, sel)}" class="${ghost}">${esc(brief.secondaryCta)}</a>
  </div>`;
}

function heroHtml(
  brief: CreativeBrief,
  dna: DesignDna,
  sel: CompositionSelection,
  heroImg: string
): string {
  const title = esc(brief.heroTitle);
  const sub = esc(brief.heroSubtitle);
  const name = esc(brief.businessName);
  const family = dna.heroFamily;
  const size = h1Size(dna);
  const sector = brief.sectorId;
  const bit = seedBit(brief.uniquenessSeed, 2);
  const wide = bit % 2 === 0 ? '1.15fr 0.85fr' : '0.9fr 1.1fr';

  if (family === 'splitMediaRight' || family === 'splitMediaLeft') {
    const mediaFirst = family === 'splitMediaLeft';
    const cols = mediaFirst ? `minmax(0,1.05fr) minmax(0,0.95fr)` : wide;
    const media = `<div class="cua-hero-media reveal" style="min-height:min(88vh,920px);background:url('${heroImg}') center/cover no-repeat;" role="img" aria-label="${name}" data-cua-hero-bg></div>`;
    const copy = `<div class="cua-hero-copy reveal" style="padding:clamp(3.5rem,9vw,7rem) clamp(1.5rem,5vw,4.5rem);display:flex;flex-direction:column;justify-content:center;background:var(--cua-light);position:relative;">
      <p class="cua-brand">${name}</p>
      <h1 style="font-family:var(--cua-font-h);font-size:${size};line-height:1.02;margin:.35rem 0 1.1rem;color:var(--cua-dark);max-width:12ch;letter-spacing:-.02em;">${title}</h1>
      <p class="cua-lede" style="max-width:34ch;">${sub}</p>
      ${ctaRow(brief, sel)}
      <span class="cua-accent-rule" aria-hidden="true"></span>
    </div>`;
    return `<section id="inicio" class="cua-hero cua-hero-split" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="display:grid;grid-template-columns:${cols};min-height:min(88vh,920px);">
      ${mediaFirst ? media + copy : copy + media}
    </section>`;
  }

  if (family === 'minimalTypeOnly') {
    return `<section id="inicio" class="cua-hero cua-hero-type" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:78vh;display:grid;grid-template-columns:1.2fr 0.8fr;background:var(--cua-light);position:relative;overflow:hidden;">
      <div class="reveal" style="padding:clamp(5rem,12vw,8rem) 8vw 4rem;align-self:center;max-width:40rem;">
        <p class="cua-brand">${name}</p>
        <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:.6rem 0 1rem;color:var(--cua-dark);max-width:15ch;letter-spacing:-.03em;">${title}</h1>
        <p class="cua-lede" style="max-width:38ch;">${sub}</p>
        ${ctaRow(brief, sel)}
      </div>
      <div class="reveal" style="position:relative;min-height:60vh;">
        <div style="position:absolute;inset:8% 8% 12% 0;background:url('${heroImg}') center/cover;clip-path:polygon(12% 0,100% 0,100% 100%,0 100%);" data-cua-hero-bg role="img" aria-label="${name}"></div>
      </div>
    </section>`;
  }

  if (family === 'editorialStack') {
    return `<section id="inicio" class="cua-hero cua-hero-editorial" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="padding:clamp(4rem,8vw,6.5rem) 6vw 2.5rem;background:var(--cua-light);">
      <div class="reveal" style="max-width:1180px;margin:0 auto;">
        <p class="cua-brand" style="margin-bottom:1.25rem;">${name}</p>
        <div style="display:grid;grid-template-columns:1.25fr 0.75fr;gap:clamp(1.5rem,4vw,3.5rem);align-items:end;">
          <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:0;color:var(--cua-dark);line-height:1.02;letter-spacing:-.03em;max-width:14ch;">${title}</h1>
          <div>
            <p class="cua-lede">${sub}</p>
            ${ctaRow(brief, sel)}
          </div>
        </div>
        <div style="margin-top:clamp(2rem,4vw,3.5rem);height:min(52vh,560px);overflow:hidden;border-radius:var(--cua-radius);">
          <img src="${heroImg}" alt="${name}" data-cua-hero-bg class="cua-kenburns" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
    </section>`;
  }

  if (family === 'asymmetricOverlap') {
    return `<section id="inicio" class="cua-hero cua-hero-overlap" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="padding:clamp(3.5rem,7vw,6rem) 6vw;background:var(--cua-surface);overflow:hidden;">
      <div style="max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:center;min-height:70vh;">
        <div class="reveal" style="z-index:2;padding-right:8%;">
          <p class="cua-brand">${name}</p>
          <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:.5rem 0 1rem;color:var(--cua-dark);max-width:11ch;letter-spacing:-.03em;">${title}</h1>
          <p class="cua-lede" style="max-width:32ch;">${sub}</p>
          ${ctaRow(brief, sel)}
        </div>
        <div class="reveal" style="position:relative;min-height:520px;">
          <img src="${heroImg}" alt="${name}" data-cua-hero-bg style="position:absolute;inset:0;width:108%;height:100%;object-fit:cover;border-radius:var(--cua-radius);transform:translateX(-6%) rotate(${bit % 2 ? -1.2 : 1.2}deg);box-shadow:0 40px 80px color-mix(in srgb,var(--cua-dark) 22%,transparent);" />
          <div aria-hidden="true" style="position:absolute;left:-12%;bottom:8%;width:42%;aspect-ratio:4/5;background:var(--cua-accent);opacity:.12;border-radius:var(--cua-radius);"></div>
        </div>
      </div>
    </section>`;
  }

  // fullBleedCenter / fullBleedLeft — brand + one headline + one line + CTAs only
  const left = family === 'fullBleedLeft';
  const lightText = sector === 'clinic' || sector === 'legal' ? 'var(--cua-dark)' : '#fff';
  const onDark = !(sector === 'clinic' || sector === 'legal');
  return `<section id="inicio" class="cua-hero cua-hero-bleed" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:92vh;display:flex;align-items:center;justify-content:${left ? 'flex-start' : 'center'};text-align:${left ? 'left' : 'center'};background:${bleedOverlay(sector)},url('${heroImg}') center/cover no-repeat;color:${lightText};padding:7rem 6vw 5rem;position:relative;">
    <div class="reveal" style="max-width:${left ? '640px' : '780px'};${left ? '' : 'margin:0 auto;'}">
      <p class="cua-brand" style="color:inherit;opacity:.95;">${name}</p>
      <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:1rem 0;line-height:1.02;letter-spacing:-.02em;">${title}</h1>
      <p style="font-size:1.08rem;opacity:.92;max-width:40ch;${left ? '' : 'margin-left:auto;margin-right:auto;'}line-height:1.55;">${sub}</p>
      <div style="${left ? '' : 'display:flex;justify-content:center;'}">${ctaRow(brief, sel, onDark)}</div>
    </div>
    <span data-cua-hero-bg style="display:none;"></span>
  </section>`;
}

function navHtml(brief: CreativeBrief, dna: DesignDna, sel: CompositionSelection): string {
  const name = esc(brief.businessName);
  const overBleed = /fullBleed|bleed/i.test(dna.heroFamily);
  const links = [
    ['#inicio', brief.lang === 'es' ? 'Inicio' : 'Home'],
    ['#nosotros', brief.lang === 'es' ? 'Nosotros' : 'About'],
    ['#servicios', brief.lang === 'es' ? 'Servicios' : 'Services'],
    ['#galeria', brief.lang === 'es' ? 'Galería' : 'Gallery'],
    ['#contacto', brief.lang === 'es' ? 'Contacto' : 'Contact'],
  ];
  const navStyle = overBleed
    ? 'position:absolute;top:0;left:0;right:0;z-index:60;background:transparent;border:none;'
    : 'position:sticky;top:0;z-index:50;backdrop-filter:blur(14px);background:color-mix(in srgb,var(--cua-surface) 90%,transparent);border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 8%,transparent);';
  const linkColor = overBleed && !/clinic|legal/.test(brief.sectorId) ? 'rgba(255,255,255,.88)' : 'var(--cua-muted)';
  const brandColor = overBleed && !/clinic|legal/.test(brief.sectorId) ? '#fff' : 'var(--cua-dark)';
  return `<header class="cua-nav" data-cua-comp="${sel.navId}" style="${navStyle}">
  <div style="max-width:1200px;margin:0 auto;padding:1.05rem 6vw;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
    <a href="#inicio" style="font-family:var(--cua-font-h);font-size:1.35rem;color:${brandColor};text-decoration:none;font-weight:600;letter-spacing:-.01em;">${name}</a>
    <nav aria-label="Main" style="display:flex;gap:1.35rem;flex-wrap:wrap;align-items:center;">
      ${links.map(([h, l]) => `<a href="${h}" style="color:${linkColor};text-decoration:none;font-size:.88rem;letter-spacing:.02em;">${l}</a>`).join('')}
      <a href="#contacto" class="cua-btn-primary" style="padding:.55rem 1.05rem;font-size:.82rem;">${esc(brief.primaryCta)}</a>
    </nav>
  </div>
</header>`;
}

function servicesHtml(brief: CreativeBrief, dna: DesignDna, sel: CompositionSelection): string {
  const editorial = /legal|architecture|clinic|corporate/.test(brief.sectorId) || dna.density === 'sparse';
  const label = brief.lang === 'es' ? 'Servicios' : 'Services';
  const heading =
    brief.lang === 'es'
      ? brief.sectorId === 'restaurant'
        ? 'Sabores y momentos'
        : 'Lo que hacemos con criterio'
      : 'What we do with judgment';

  if (editorial) {
    const rows = brief.services
      .map(
        (s, i) => `<a href="#contacto" class="cua-service-row reveal" style="animation-delay:${i * 60}ms">
      <span class="cua-idx">${String(i + 1).padStart(2, '0')}</span>
      <span class="cua-service-title">${esc(s)}</span>
      <span class="cua-service-arrow" aria-hidden="true">→</span>
    </a>`
      )
      .join('\n');
    return `<section id="servicios" class="cua-section" data-cua-comp="${sel.featuresId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-surface);">
  <div style="max-width:920px;margin:0 auto;">
    <p class="cua-kicker">${label}</p>
    <h2 class="cua-h2">${heading}</h2>
    <div style="margin-top:2.25rem;border-top:1px solid color-mix(in srgb,var(--cua-dark) 12%,transparent);">${rows}</div>
  </div>
</section>`;
  }

  const cards = brief.services
    .map((s, i) => {
      const icon =
        brief.iconStyle === 'emoji'
          ? ['🍝', '🍷', '🔥', '🌿', '☕', '🍰'][i % 6]
          : brief.iconStyle === 'none'
            ? ''
            : `<span class="cua-line-icon" aria-hidden="true"></span>`;
      return `<article class="cua-feature reveal" data-cua-comp="${sel.cardId}" style="animation-delay:${i * 50}ms">
        <div style="margin-bottom:.85rem;font-size:1.35rem;">${icon}</div>
        <h3 style="font-family:var(--cua-font-h);margin:0 0 .45rem;color:var(--cua-dark);font-size:1.2rem;">${esc(s)}</h3>
        <p style="margin:0;color:var(--cua-muted);font-size:.95rem;line-height:1.55;">${
          brief.lang === 'es'
            ? 'Hecho para sentirse, no solo para verse.'
            : 'Made to be felt, not just seen.'
        }</p>
      </article>`;
    })
    .join('\n');
  const cols =
    brief.density === 'dense'
      ? 'repeat(3,minmax(0,1fr))'
      : 'repeat(auto-fit,minmax(240px,1fr))';
  return `<section id="servicios" class="cua-section" data-cua-comp="${sel.featuresId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-light);">
  <div style="max-width:1120px;margin:0 auto;">
    <p class="cua-kicker">${label}</p>
    <h2 class="cua-h2" style="max-width:16ch;">${heading}</h2>
    <div style="display:grid;grid-template-columns:${cols};gap:1.5rem;margin-top:2.5rem;">${cards}</div>
  </div>
</section>`;
}

function aboutHtml(brief: CreativeBrief, dna: DesignDna, sel: CompositionSelection, aboutImg: string): string {
  const flip = seedBit(brief.uniquenessSeed, 0) % 2 === 0;
  const overlap = dna.rhythm === 'editorialBreaks' || dna.heroFamily === 'asymmetricOverlap';
  const img = `<div class="reveal" style="min-height:${overlap ? '520px' : '460px'};background:url('${aboutImg}') center/cover;border-radius:var(--cua-radius);${
    overlap ? 'transform:translateY(1.5rem);box-shadow:0 28px 60px color-mix(in srgb,var(--cua-dark) 16%,transparent);' : ''
  }"></div>`;
  const copy = `<div class="reveal" style="padding:${overlap ? '2rem 0 0' : '1rem 0'};">
    <p class="cua-kicker">${brief.lang === 'es' ? 'Nosotros' : 'About'}</p>
    <h2 class="cua-h2" style="max-width:14ch;">${esc(brief.positioning)}</h2>
    <p class="cua-lede" style="max-width:40ch;margin-top:1rem;">${esc(brief.audience)}</p>
    <p style="color:var(--cua-muted);line-height:1.7;max-width:42ch;margin-top:.75rem;">${esc(brief.photoStyle)}.</p>
  </div>`;
  return `<section id="nosotros" class="cua-section" data-cua-comp="${sel.aboutId}" style="padding:clamp(4.5rem,9vw,8rem) 6vw;background:var(--cua-surface);">
  <div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:${
    overlap ? '0.95fr 1.05fr' : '1fr 1fr'
  };gap:clamp(2rem,5vw,4rem);align-items:center;">
    ${flip ? copy + img : img + copy}
  </div>
</section>`;
}

function galleryHtml(brief: CreativeBrief, sel: CompositionSelection, gallery: string[]): string {
  const imgs = gallery.slice(0, 6);
  // Bento: first large, then varied cells — not a flat 3×2 card grid
  const cells = imgs
    .map((src, i) => {
      const span =
        i === 0
          ? 'grid-column:span 2;grid-row:span 2;min-height:420px;'
          : i === 3
            ? 'grid-column:span 2;min-height:220px;'
            : 'min-height:220px;';
      return `<figure class="reveal" style="${span}margin:0;overflow:hidden;border-radius:var(--cua-radius);">
        <img src="${src}" alt="${esc(brief.businessName)} ${i + 1}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform 1.1s ease;" />
      </figure>`;
    })
    .join('\n');
  return `<section id="galeria" class="cua-section cua-gallery" data-cua-comp="${sel.galleryId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-light);">
  <div style="max-width:1180px;margin:0 auto;">
    <p class="cua-kicker">${brief.lang === 'es' ? 'Galería' : 'Gallery'}</p>
    <h2 class="cua-h2" style="margin-bottom:1.75rem;">${
      brief.lang === 'es' ? 'Una mirada al ambiente' : 'A look at the atmosphere'
    }</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;grid-auto-flow:dense;">${cells}</div>
  </div>
</section>`;
}

function whyHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const items =
    brief.lang === 'es'
      ? [
          ['Criterio', 'Decisiones con intención, no plantillas.'],
          ['Detalle', 'Cada sección tiene un solo trabajo.'],
          ['Presencia', 'Una identidad que se reconoce al instante.'],
        ]
      : [
          ['Judgment', 'Intentional decisions, not templates.'],
          ['Detail', 'Each section has one job.'],
          ['Presence', 'An identity recognized instantly.'],
        ];
  return `<section id="por-que" class="cua-section" data-cua-comp="${sel.featuresId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-dark);color:#fff;">
  <div style="max-width:1120px;margin:0 auto;">
    <p class="cua-kicker" style="color:var(--cua-accent);">${brief.lang === 'es' ? 'Por qué' : 'Why'}</p>
    <h2 style="font-family:var(--cua-font-h);font-size:clamp(1.9rem,3.5vw,2.8rem);margin:.4rem 0 2.5rem;max-width:16ch;">${
      brief.lang === 'es' ? 'La diferencia está en el detalle' : 'The difference is in the detail'
    }</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;">
      ${items
        .map(
          ([t, p], i) =>
            `<div class="reveal" style="animation-delay:${i * 70}ms;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,.18);">
              <h3 style="margin:0 0 .6rem;color:var(--cua-accent);font-family:var(--cua-font-h);font-size:1.35rem;">${t}</h3>
              <p style="margin:0;opacity:.86;line-height:1.6;">${p}</p>
            </div>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

function testimonialsHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const quotes =
    brief.lang === 'es'
      ? [
          ['Excelente atención y resultado impecable.', 'Cliente verificado'],
          ['Se nota el criterio profesional en cada detalle.', 'Reseña Google'],
          ['Volveremos. Ambiente y calidad de primer nivel.', 'Huésped'],
        ]
      : [
          ['Excellent care and impeccable result.', 'Verified client'],
          ['Professional judgment in every detail.', 'Google review'],
          ['We will return. Top-tier atmosphere and quality.', 'Guest'],
        ];
  return `<section id="opiniones" class="cua-section" data-cua-comp="${sel.testimonialId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-surface);">
  <div style="max-width:1000px;margin:0 auto;">
    <p class="cua-kicker">${brief.lang === 'es' ? 'Opiniones' : 'Testimonials'}</p>
    <h2 class="cua-h2" style="margin-bottom:2rem;">${brief.lang === 'es' ? 'Lo que dejan dicho' : 'What people leave behind'}</h2>
    <div style="display:grid;gap:1.75rem;">
      ${quotes
        .map(
          ([q, a], i) =>
            `<blockquote class="reveal" style="animation-delay:${i * 60}ms;margin:0;padding:0 0 1.5rem;border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 10%,transparent);">
              <p style="font-family:var(--cua-font-h);font-size:clamp(1.25rem,2.4vw,1.75rem);color:var(--cua-dark);line-height:1.35;margin:0;">“${q}”</p>
              <footer style="margin-top:.9rem;color:var(--cua-muted);font-size:.88rem;">— ${a}</footer>
            </blockquote>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

function faqHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const faqs =
    brief.lang === 'es'
      ? [
          ['¿Cómo reservo?', 'Usa el formulario de contacto o el botón principal del hero.'],
          ['¿Dónde estáis?', brief.address || 'Consulta la sección de contacto.'],
          ['¿Qué incluye?', 'Te lo detallamos en la primera conversación, sin letra pequeña.'],
        ]
      : [
          ['How do I book?', 'Use the contact form or the primary hero button.'],
          ['Where are you?', brief.address || 'See the contact section.'],
          ['What is included?', 'We clarify scope in the first conversation.'],
        ];
  return `<section id="faq" class="cua-section" data-cua-comp="${sel.faqId}" style="padding:clamp(4rem,7vw,6rem) 6vw;background:var(--cua-light);">
  <div style="max-width:720px;margin:0 auto;">
    <h2 class="cua-h2">FAQ</h2>
    ${faqs
      .map(
        ([q, a]) =>
          `<details style="border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 10%,transparent);padding:1.1rem 0;">
            <summary style="cursor:pointer;font-weight:600;color:var(--cua-dark);font-size:1.05rem;">${esc(q)}</summary>
            <p style="color:var(--cua-muted);margin:.8rem 0 0;line-height:1.6;">${esc(a)}</p>
          </details>`
      )
      .join('')}
  </div>
</section>`;
}

function contactHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  return `<section id="contacto" class="cua-section" data-cua-comp="${sel.formId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-surface);">
  <div style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:0.9fr 1.1fr;gap:clamp(2rem,5vw,3.5rem);align-items:start;">
    <div class="reveal">
      <p class="cua-kicker">${brief.lang === 'es' ? 'Contacto' : 'Contact'}</p>
      <h2 class="cua-h2">${brief.lang === 'es' ? 'Hablemos' : 'Let’s talk'}</h2>
      <p class="cua-lede">${esc(
        brief.address ||
          (brief.lang === 'es' ? 'Escríbenos y te respondemos pronto.' : 'Write to us and we will reply soon.')
      )}</p>
      ${brief.hours ? `<p style="color:var(--cua-muted);margin-top:.75rem;">${esc(brief.hours)}</p>` : ''}
    </div>
    <form class="reveal" style="display:grid;gap:.85rem;" onsubmit="return false;">
      <label class="cua-field">${brief.lang === 'es' ? 'Nombre' : 'Name'}<input required name="name" /></label>
      <label class="cua-field">Email<input required type="email" name="email" /></label>
      <label class="cua-field">${brief.lang === 'es' ? 'Mensaje' : 'Message'}<textarea name="msg" rows="4"></textarea></label>
      <button type="submit" class="cua-btn-primary" data-cua-comp="${sel.ctaId}">${esc(brief.primaryCta)}</button>
    </form>
  </div>
</section>`;
}

function footerHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const name = esc(brief.businessName);
  return `<footer class="cua-footer" data-cua-comp="${sel.footerId}" style="padding:3.25rem 6vw;background:var(--cua-dark);color:rgba(255,255,255,.82);">
  <div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:1.75rem;align-items:end;">
    <div>
      <strong style="font-family:var(--cua-font-h);color:#fff;font-size:1.45rem;letter-spacing:-.01em;">${name}</strong>
      <p style="margin:.65rem 0 0;max-width:34ch;opacity:.72;line-height:1.55;">${esc(brief.positioning)}</p>
    </div>
    <div style="display:flex;gap:1.15rem;flex-wrap:wrap;align-items:center;">
      <button type="button" class="cua-legal-btn" onclick="openModal('aviso')">${brief.lang === 'es' ? 'Aviso legal' : 'Legal'}</button>
      <button type="button" class="cua-legal-btn" onclick="openModal('privacidad')">${brief.lang === 'es' ? 'Privacidad' : 'Privacy'}</button>
      <button type="button" class="cua-legal-btn" onclick="openModal('cookies')">Cookies</button>
    </div>
  </div>
</footer>`;
}

function sectionFor(
  key: string,
  brief: CreativeBrief,
  dna: DesignDna,
  sel: CompositionSelection,
  imgs: { hero: string; gallery: string[]; about: string }
): string {
  const k = key.toLowerCase();
  if (k === 'hero' || k === 'inicio') return '';
  if (
    k.includes('service') ||
    k.includes('menu') ||
    k.includes('practice') ||
    k.includes('product') ||
    k.includes('room') ||
    k.includes('treatment')
  )
    return servicesHtml(brief, dna, sel);
  if (
    k.includes('about') ||
    k.includes('nosotros') ||
    k.includes('philosophy') ||
    k.includes('studio') ||
    k.includes('trust') ||
    k.includes('position') ||
    k.includes('atmosphere')
  )
    return aboutHtml(brief, dna, sel, imgs.about);
  if (k.includes('galer') || k.includes('gallery') || k.includes('lookbook') || k.includes('project'))
    return galleryHtml(brief, sel, imgs.gallery);
  if (
    k.includes('why') ||
    k.includes('por') ||
    k.includes('experience') ||
    k.includes('method') ||
    k.includes('process')
  )
    return whyHtml(brief, sel);
  if (k.includes('testimonial') || k.includes('opinion') || k.includes('review') || k.includes('insight'))
    return testimonialsHtml(brief, sel);
  if (k.includes('faq')) return faqHtml(brief, sel);
  if (k.includes('contact') || k.includes('reserva') || k.includes('booking')) return contactHtml(brief, sel);
  return '';
}

export interface RenderInput {
  brief: CreativeBrief;
  dna: DesignDna;
  selection: CompositionSelection;
  clientImageUrls?: string[];
}

export function renderConstrainedHtml(input: RenderInput): string {
  const { brief, dna, selection: sel } = input;
  const packKey = dna.imagePackKey as ImageBankCategory;
  const imgs = packUrls(packKey);
  if (input.clientImageUrls?.[0]) imgs.hero = input.clientImageUrls[0];
  if (input.clientImageUrls?.[1]) imgs.about = input.clientImageUrls[1];

  const cssVars = Object.entries(dna.palette.cssVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');

  const bodySections: string[] = [];
  const seen = new Set<string>();
  for (const key of sel.sectionOrder) {
    const html = sectionFor(key, brief, dna, sel, imgs);
    if (!html) continue;
    const id = html.match(/id="([^"]+)"/)?.[1] || key;
    if (seen.has(id)) continue;
    seen.add(id);
    bodySections.push(html);
  }
  if (!seen.has('servicios')) bodySections.unshift(servicesHtml(brief, dna, sel));
  if (!seen.has('nosotros')) bodySections.splice(1, 0, aboutHtml(brief, dna, sel, imgs.about));
  if (!seen.has('galeria')) bodySections.push(galleryHtml(brief, sel, imgs.gallery));
  if (!seen.has('contacto')) bodySections.push(contactHtml(brief, sel));

  const title = `${esc(brief.businessName)} | ${esc(brief.positioning).slice(0, 60)}`;
  const desc = esc(brief.heroSubtitle);
  const motion = dna.motionLevel !== 'none';

  return `<!DOCTYPE html>
<html lang="${brief.lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${dna.typography.googleFontsUrl}" rel="stylesheet" />
<style>
:root{${cssVars};--cua-font-h:'${dna.typography.heading}',Georgia,serif;--cua-font-b:'${dna.typography.body}',system-ui,sans-serif;--cua-radius:${radiusCss(dna.radius)};}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:var(--cua-font-b);background:var(--cua-light);color:var(--cua-dark);line-height:1.5;-webkit-font-smoothing:antialiased;}
img{max-width:100%;display:block;}
.cua-brand{font-family:var(--cua-font-h);font-size:clamp(1.15rem,2.2vw,1.55rem);font-weight:600;letter-spacing:-.01em;margin:0;color:var(--cua-dark);}
.cua-kicker{letter-spacing:.18em;text-transform:uppercase;font-size:.68rem;color:var(--cua-accent);margin:0 0 .55rem;font-weight:600;}
.cua-h2{font-family:var(--cua-font-h);font-size:clamp(1.85rem,3.4vw,2.75rem);color:var(--cua-dark);margin:0;line-height:1.08;letter-spacing:-.02em;}
.cua-lede{font-size:1.05rem;color:var(--cua-muted);line-height:1.65;margin:0;}
.cua-cta-row{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.75rem;}
.cua-btn-primary{display:inline-block;background:var(--cua-accent);color:#fff;text-decoration:none;padding:.9rem 1.4rem;border-radius:var(--cua-radius);font-weight:600;border:none;cursor:pointer;font-family:var(--cua-font-b);transition:transform .25s ease,filter .25s ease;}
.cua-btn-primary:hover{transform:translateY(-1px);filter:brightness(1.05);}
.cua-btn-ghost{display:inline-block;background:transparent;color:var(--cua-dark);text-decoration:none;padding:.9rem 1.4rem;border-radius:var(--cua-radius);border:1px solid color-mix(in srgb,var(--cua-dark) 18%,transparent);font-weight:600;}
.cua-btn-on-dark{display:inline-block;background:transparent;color:#fff;text-decoration:none;padding:.9rem 1.4rem;border-radius:var(--cua-radius);border:1px solid rgba(255,255,255,.55);font-weight:600;}
.cua-hero{position:relative;overflow:hidden;}
.cua-accent-rule{display:block;width:48px;height:2px;background:var(--cua-accent);margin-top:2rem;}
.cua-service-row{display:grid;grid-template-columns:auto 1fr auto;gap:1.25rem;align-items:center;padding:1.15rem 0;border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 12%,transparent);text-decoration:none;color:inherit;transition:padding-left .25s ease;}
.cua-service-row:hover{padding-left:.35rem;}
.cua-idx{font-size:.75rem;letter-spacing:.12em;color:var(--cua-accent);font-weight:600;}
.cua-service-title{font-family:var(--cua-font-h);font-size:1.35rem;color:var(--cua-dark);}
.cua-service-arrow{color:var(--cua-accent);opacity:.7;}
.cua-feature{padding:1.6rem 0 1.35rem;border-top:1px solid color-mix(in srgb,var(--cua-dark) 10%,transparent);}
.cua-line-icon{display:inline-block;width:2rem;height:2px;background:var(--cua-accent);}
.cua-field{display:grid;gap:.4rem;color:var(--cua-muted);font-size:.82rem;}
.cua-field input,.cua-field textarea{padding:.85rem 1rem;border:1px solid color-mix(in srgb,var(--cua-dark) 14%,transparent);border-radius:var(--cua-radius);background:var(--cua-light);font:inherit;color:var(--cua-dark);}
.cua-legal-btn{background:none;border:none;color:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:0;font:inherit;opacity:.85;}
.cua-gallery figure img:hover{transform:scale(1.04);}
${
  motion
    ? `@keyframes cua-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes cua-ken{from{transform:scale(1)}to{transform:scale(1.06)}}
.reveal{animation:cua-rise .85s cubic-bezier(.22,1,.36,1) both;}
.cua-kenburns{animation:cua-ken 14s ease-out alternate infinite;}`
    : `.reveal{opacity:1;}`
}
@media (max-width:900px){
  .cua-hero-split,.cua-hero-type,.cua-hero-editorial > div > div,.cua-hero-overlap > div,#nosotros > div,#contacto > div,.cua-gallery > div > div,#por-que > div > div:last-child{grid-template-columns:1fr !important;}
  .cua-hero-type > div:last-child{min-height:42vh !important;}
  .cua-nav nav a:not(.cua-btn-primary){display:none;}
  .cua-gallery > div > div{grid-template-columns:1fr 1fr !important;}
  .cua-gallery figure[style*="span 2"]{grid-column:span 2 !important;grid-row:span 1 !important;min-height:240px !important;}
}
</style>
<meta name="creauna-dna" content="${esc(dna.id)}" />
<meta name="creauna-layout" content="${esc(sel.layout.id)}" />
<meta name="creauna-seed" content="${esc(brief.uniquenessSeed)}" />
<meta name="creauna-sector" content="${esc(brief.sectorId)}" />
</head>
<body data-cua-creative="1" data-cua-dna="${esc(dna.id)}" data-cua-layout="${esc(sel.layout.id)}" data-cua-composition="v2">
${navHtml(brief, dna, sel)}
${heroHtml(brief, dna, sel, imgs.hero)}
${bodySections.join('\n')}
${footerHtml(brief, sel)}
<script>
function openModal(kind){
  var m=document.getElementById('cua-legal-modal');
  if(!m)return;
  var titles={aviso:'Aviso legal',privacidad:'Privacidad',cookies:'Cookies',accesibilidad:'Accesibilidad'};
  var t=document.getElementById('cua-legal-title');
  var b=document.getElementById('cua-legal-body');
  if(t)t.textContent=titles[kind]||kind;
  if(b)b.textContent='Texto legal de '+ (titles[kind]||kind) +' para ${esc(brief.businessName)}. Contacta para la versión completa.';
  m.style.display='flex';
}
function closeModal(){var m=document.getElementById('cua-legal-modal');if(m)m.style.display='none';}
</script>
</body>
</html>`;
}
