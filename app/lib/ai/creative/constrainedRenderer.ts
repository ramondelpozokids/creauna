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

/** Alturas de hero desde density del brief (contrato), no caps globales parcheados. */
function heroScale(brief: CreativeBrief): {
  section: string;
  media: string;
  typeMedia: string;
  editorialImg: string;
  overlap: string;
  overlapMedia: string;
  bleed: string;
  bleedPad: string;
} {
  // Techo visual: todas las familias ≥88vh (demos ~100vh); sin caps de parche por cliente
  switch (brief.density) {
    case 'sparse':
      return {
        section: 'min(90vh,920px)',
        media: 'min(90vh,920px)',
        typeMedia: 'min(72vh,720px)',
        editorialImg: 'min(58vh,620px)',
        overlap: 'min(90vh,920px)',
        overlapMedia: 'min(78vh,780px)',
        bleed: 'min(94vh,980px)',
        bleedPad: '6.5rem 6vw 4.5rem',
      };
    case 'dense':
      return {
        section: 'min(92vh,960px)',
        media: 'min(92vh,960px)',
        typeMedia: 'min(76vh,780px)',
        editorialImg: 'min(62vh,680px)',
        overlap: 'min(92vh,960px)',
        overlapMedia: 'min(82vh,840px)',
        bleed: 'min(96vh,1040px)',
        bleedPad: '7rem 6vw 5rem',
      };
    default:
      return {
        section: 'min(92vh,940px)',
        media: 'min(92vh,940px)',
        typeMedia: 'min(74vh,740px)',
        editorialImg: 'min(60vh,640px)',
        overlap: 'min(92vh,940px)',
        overlapMedia: 'min(80vh,800px)',
        bleed: 'min(96vh,1000px)',
        bleedPad: '6.75rem 6vw 4.75rem',
      };
  }
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
  if (r === 'craft') return '3px';
  return '10px';
}

function seedBit(seed: string, i: number): number {
  return seed.charCodeAt(i % seed.length) || 1;
}

function h1Size(dna: DesignDna): string {
  if (dna.typography.scale === 'billboard') return 'clamp(2.9rem, 8vw, 5.4rem)';
  if (dna.typography.scale === 'intimate') return 'clamp(2.05rem, 4.2vw, 3.1rem)';
  return 'clamp(2.35rem, 5.8vw, 4.2rem)';
}

/** Overlay desde DNA (mood/paleta), no wash clínico fijo por sector. */
function bleedOverlay(dna: DesignDna): string {
  const mood = dna.mood;
  if (mood === 'aspirationalLuxury' || mood === 'clinicalLight') {
    return 'linear-gradient(105deg,color-mix(in srgb,var(--cua-dark) 55%,transparent) 0%,color-mix(in srgb,var(--cua-dark) 28%,transparent) 45%,color-mix(in srgb,var(--cua-dark) 62%,transparent) 100%)';
  }
  if (mood === 'soberCorporate') {
    return 'linear-gradient(90deg,color-mix(in srgb,var(--cua-light) 92%,transparent) 0%,color-mix(in srgb,var(--cua-light) 55%,transparent) 42%,color-mix(in srgb,var(--cua-dark) 45%,transparent) 100%)';
  }
  if (mood === 'spatialMinimal') {
    return 'linear-gradient(180deg,rgba(255,255,255,.12) 0%,color-mix(in srgb,var(--cua-dark) 55%,transparent) 100%)';
  }
  if (mood === 'gastronomicEmotion' || mood === 'warmNeighborhood' || mood === 'earthyArtisan') {
    return 'linear-gradient(180deg,color-mix(in srgb,var(--cua-dark) 22%,transparent) 0%,color-mix(in srgb,var(--cua-dark) 68%,transparent) 100%)';
  }
  if (mood === 'darkCraft') {
    return 'linear-gradient(180deg,color-mix(in srgb,var(--cua-dark) 40%,transparent) 0%,color-mix(in srgb,var(--cua-dark) 82%,transparent) 100%)';
  }
  return 'linear-gradient(180deg,rgba(0,0,0,.28) 0%,rgba(0,0,0,.58) 100%)';
}

function isCraftChrome(dna: DesignDna): boolean {
  return (
    dna.radius === 'craft' ||
    dna.radius === 'sharp' ||
    dna.mood === 'aspirationalLuxury' ||
    dna.mood === 'darkCraft' ||
    dna.mood === 'gastronomicEmotion'
  );
}

function secondaryHref(brief: CreativeBrief, sel: CompositionSelection): string {
  const order = sel.sectionOrder.join(' ');
  if (/menu|carta|service|practice|product|room|treatment/i.test(order)) return '#servicios';
  if (/galer|gallery|project|lookbook/i.test(order)) return '#galeria';
  return '#nosotros';
}

function ctaRow(brief: CreativeBrief, sel: CompositionSelection, onDark = false, craft = false): string {
  const ghost = onDark ? 'cua-btn-on-dark' : 'cua-btn-ghost';
  const craftCls = craft ? ' cua-btn-craft' : '';
  return `<div class="cua-cta-row">
    <a href="#contacto" class="cua-btn-primary${craftCls}">${esc(brief.primaryCta)}</a>
    <a href="${secondaryHref(brief, sel)}" class="${ghost}${craftCls}">${esc(brief.secondaryCta)}</a>
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
  const hv = heroScale(brief);
  const craft = isCraftChrome(dna);

  if (family === 'splitMediaRight' || family === 'splitMediaLeft') {
    const mediaFirst = family === 'splitMediaLeft';
    const cols = mediaFirst ? `minmax(0,1.05fr) minmax(0,0.95fr)` : wide;
    const media = `<div class="cua-hero-media reveal" style="min-height:${hv.media};background:linear-gradient(180deg,transparent 40%,color-mix(in srgb,var(--cua-dark) 35%,transparent) 100%),url('${heroImg}') center/cover no-repeat;" role="img" aria-label="${name}" data-cua-hero-bg></div>`;
    const copy = `<div class="cua-hero-copy reveal" style="padding:clamp(3rem,7vw,5.5rem) clamp(1.5rem,5vw,4.5rem);display:flex;flex-direction:column;justify-content:center;background:var(--cua-light);position:relative;">
      <p class="cua-brand">${name}</p>
      <h1 style="font-family:var(--cua-font-h);font-size:${size};line-height:1.02;margin:.35rem 0 1.1rem;color:var(--cua-dark);max-width:12ch;letter-spacing:-.02em;">${title}</h1>
      <p class="cua-lede" style="max-width:34ch;">${sub}</p>
      ${ctaRow(brief, sel, false, craft)}
      <span class="cua-accent-rule" aria-hidden="true"></span>
    </div>`;
    return `<section id="inicio" class="cua-hero cua-hero-split" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="display:grid;grid-template-columns:${cols};min-height:${hv.section};">
      ${mediaFirst ? media + copy : copy + media}
    </section>`;
  }

  if (family === 'minimalTypeOnly') {
    return `<section id="inicio" class="cua-hero cua-hero-type" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:${hv.section};display:grid;grid-template-columns:1.15fr 0.85fr;background:var(--cua-light);position:relative;overflow:hidden;">
      <div class="reveal" style="padding:clamp(4.5rem,11vw,7rem) 8vw 4rem;align-self:center;max-width:42rem;position:relative;z-index:2;">
        <p class="cua-brand">${name}</p>
        <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:.6rem 0 1rem;color:var(--cua-dark);max-width:14ch;letter-spacing:-.035em;">${title}</h1>
        <p class="cua-lede" style="max-width:36ch;">${sub}</p>
        ${ctaRow(brief, sel, false, craft)}
        <span class="cua-accent-rule" aria-hidden="true"></span>
      </div>
      <div class="reveal" style="position:relative;min-height:${hv.typeMedia};">
        <div style="position:absolute;inset:0 0 0 8%;background:linear-gradient(90deg,var(--cua-light) 0%,transparent 18%),url('${heroImg}') center/cover;clip-path:polygon(10% 0,100% 0,100% 100%,0 100%);" data-cua-hero-bg role="img" aria-label="${name}"></div>
      </div>
    </section>`;
  }

  if (family === 'editorialStack') {
    return `<section id="inicio" class="cua-hero cua-hero-editorial" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:${hv.section};padding:clamp(4rem,8vw,6rem) 6vw 0;background:var(--cua-light);display:flex;flex-direction:column;">
      <div class="reveal" style="max-width:1180px;margin:0 auto;width:100%;flex:1;display:flex;flex-direction:column;">
        <p class="cua-brand" style="margin-bottom:1.25rem;">${name}</p>
        <div style="display:grid;grid-template-columns:1.3fr 0.7fr;gap:clamp(1.5rem,4vw,3.5rem);align-items:end;">
          <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:0;color:var(--cua-dark);line-height:1.02;letter-spacing:-.035em;max-width:13ch;">${title}</h1>
          <div>
            <p class="cua-lede">${sub}</p>
            ${ctaRow(brief, sel, false, craft)}
          </div>
        </div>
        <div style="margin-top:auto;padding-top:clamp(2rem,4vw,3rem);height:${hv.editorialImg};min-height:${hv.editorialImg};overflow:hidden;border-radius:var(--cua-radius);">
          <img src="${heroImg}" alt="${name}" data-cua-hero-bg class="cua-kenburns" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
    </section>`;
  }

  if (family === 'asymmetricOverlap') {
    const flip = bit % 2 === 0;
    const copyBlock = `<div class="reveal" style="z-index:2;padding:${flip ? '0 10% 0 0' : '0 0 0 10%'};max-width:34rem;">
          <p class="cua-brand">${name}</p>
          <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:.5rem 0 1rem;color:var(--cua-dark);max-width:11ch;letter-spacing:-.035em;">${title}</h1>
          <p class="cua-lede" style="max-width:32ch;">${sub}</p>
          ${ctaRow(brief, sel, false, craft)}
          <span class="cua-accent-rule" aria-hidden="true"></span>
        </div>`;
    const mediaBlock = `<div class="reveal" style="position:relative;min-height:${hv.overlapMedia};">
          <img src="${heroImg}" alt="${name}" data-cua-hero-bg style="position:absolute;inset:0;width:112%;height:100%;object-fit:cover;border-radius:var(--cua-radius);transform:translateX(${flip ? '-8%' : '0'}) rotate(${flip ? -1.5 : 1.5}deg);box-shadow:0 48px 90px color-mix(in srgb,var(--cua-dark) 24%,transparent);" />
          <div aria-hidden="true" style="position:absolute;${flip ? 'left:-14%' : 'right:-10%'};bottom:6%;width:38%;aspect-ratio:3/4;background:linear-gradient(160deg,var(--cua-accent),transparent);opacity:.18;border-radius:var(--cua-radius);"></div>
          <div aria-hidden="true" style="position:absolute;${flip ? 'right:4%' : 'left:4%'};top:12%;width:3px;height:28%;background:var(--cua-accent);opacity:.55;"></div>
        </div>`;
    return `<section id="inicio" class="cua-hero cua-hero-overlap" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:${hv.overlap};padding:clamp(3.5rem,7vw,5.5rem) 6vw;background:linear-gradient(135deg,var(--cua-surface) 0%,var(--cua-light) 55%,color-mix(in srgb,var(--cua-accent) 8%,var(--cua-light)) 100%);overflow:hidden;">
      <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:${flip ? '0.92fr 1.08fr' : '1.08fr 0.92fr'};gap:0;align-items:center;min-height:${hv.overlap};">
        ${flip ? copyBlock + mediaBlock : mediaBlock + copyBlock}
      </div>
    </section>`;
  }

  // fullBleedCenter / fullBleedLeft — brand + one headline + one line + CTAs only
  const left = family === 'fullBleedLeft';
  // Overlay DNA: soberCorporate mantiene wash claro + texto oscuro; resto inmersivo
  const onDark = dna.mood !== 'soberCorporate';
  const lightText = onDark ? '#fff' : 'var(--cua-dark)';
  const bleedAlign = left ? 'flex-start' : bit % 2 === 0 ? 'center' : 'flex-end';
  const bleedText = left || bleedAlign === 'flex-start' ? 'left' : bleedAlign === 'flex-end' ? 'right' : 'center';
  return `<section id="inicio" class="cua-hero cua-hero-bleed" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:${hv.bleed};display:flex;align-items:flex-end;justify-content:${bleedAlign};text-align:${bleedText};background:${bleedOverlay(dna)},url('${heroImg}') center/cover no-repeat;color:${lightText};padding:${hv.bleedPad};position:relative;">
    <div class="reveal" style="max-width:${left || bleedText !== 'center' ? '640px' : '780px'};${bleedText === 'center' ? 'margin:0 auto;' : ''}">
      <p class="cua-brand" style="color:inherit;opacity:.95;letter-spacing:.14em;text-transform:uppercase;font-size:.78rem;">${name}</p>
      <h1 style="font-family:var(--cua-font-h);font-size:${size};margin:1rem 0;line-height:1.02;letter-spacing:-.025em;">${title}</h1>
      <p style="font-size:1.08rem;opacity:.92;max-width:40ch;${bleedText === 'center' ? 'margin-left:auto;margin-right:auto;' : ''}line-height:1.55;">${sub}</p>
      <div style="${bleedText === 'center' ? 'display:flex;justify-content:center;' : bleedText === 'right' ? 'display:flex;justify-content:flex-end;' : ''}">${ctaRow(brief, sel, onDark, craft)}</div>
    </div>
    <span data-cua-hero-bg style="display:none;"></span>
  </section>`;
}

function navHtml(brief: CreativeBrief, dna: DesignDna, sel: CompositionSelection): string {
  const name = esc(brief.businessName);
  const overBleed = /fullBleed|bleed/i.test(dna.heroFamily);
  const craft = isCraftChrome(dna);
  const navKind = sel.navId;
  const allLinks: [string, string][] = [
    ['#inicio', brief.lang === 'es' ? 'Inicio' : 'Home'],
    ['#nosotros', brief.lang === 'es' ? 'Nosotros' : 'About'],
    ['#servicios', brief.lang === 'es' ? 'Servicios' : 'Services'],
    ['#galeria', brief.lang === 'es' ? 'Galería' : 'Gallery'],
    ['#contacto', brief.lang === 'es' ? 'Contacto' : 'Contact'],
  ];
  // Variantes reales por componente (library → HTML distinto, no solo metadata)
  const links =
    navKind === 'nav-minimal-link'
      ? allLinks.filter(([h]) => h === '#inicio' || h === '#servicios' || h === '#contacto')
      : navKind === 'nav-hospitality-book'
        ? allLinks.filter(([h]) => h !== '#nosotros')
        : allLinks;
  const forceDark = navKind === 'nav-sticky-dark';
  const onDarkBleed = forceDark || (overBleed && dna.mood !== 'soberCorporate');
  const stickyAlways = forceDark || navKind === 'nav-corporate-utility' || !overBleed;
  const navStyle = forceDark
    ? 'position:sticky;top:0;z-index:60;background:color-mix(in srgb,var(--cua-dark) 92%,transparent);border-bottom:1px solid color-mix(in srgb,#fff 12%,transparent);backdrop-filter:blur(12px);'
    : stickyAlways && !overBleed
      ? 'position:sticky;top:0;z-index:50;backdrop-filter:blur(16px);background:color-mix(in srgb,var(--cua-surface) 88%,transparent);border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 8%,transparent);'
      : 'position:absolute;top:0;left:0;right:0;z-index:60;background:transparent;border:none;';
  const linkColor = onDarkBleed ? 'rgba(255,255,255,.9)' : 'var(--cua-muted)';
  const brandColor = onDarkBleed ? '#fff' : 'var(--cua-dark)';
  const useCraftType = craft || navKind === 'nav-minimal-link' || navKind === 'nav-sticky-dark';
  const linkStyle = useCraftType
    ? `color:${linkColor};text-decoration:none;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;`
    : `color:${linkColor};text-decoration:none;font-size:.88rem;letter-spacing:.02em;`;
  const brandStyle = useCraftType
    ? `font-family:var(--cua-font-h);font-size:1.55rem;color:${brandColor};text-decoration:none;font-weight:600;letter-spacing:-.02em;`
    : `font-family:var(--cua-font-h);font-size:1.35rem;color:${brandColor};text-decoration:none;font-weight:600;letter-spacing:-.01em;`;
  const ctaPad = useCraftType
    ? 'padding:.7rem 1.35rem;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;'
    : 'padding:.55rem 1.05rem;font-size:.82rem;';
  const ctaClass = `cua-btn-primary${useCraftType ? ' cua-btn-craft' : ''}`;
  const showCta = navKind !== 'nav-minimal-link';
  const hospitalityCta =
    navKind === 'nav-hospitality-book'
      ? brief.lang === 'es'
        ? brief.primaryCta || 'Reservar'
        : brief.primaryCta || 'Book'
      : brief.primaryCta;
  return `<header class="cua-nav" data-cua-nav="${esc(navKind)}" data-cua-comp="${sel.navId}" style="${navStyle}">
  <div style="max-width:1200px;margin:0 auto;padding:1.15rem 6vw;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
    <a href="#inicio" style="${brandStyle}">${name}</a>
    <nav aria-label="Main" style="display:flex;gap:${navKind === 'nav-minimal-link' ? '2rem' : '1.5rem'};flex-wrap:wrap;align-items:center;">
      ${links.map(([h, l]) => `<a class="cua-nav-link" href="${h}" style="${linkStyle}">${l}</a>`).join('')}
      ${
        showCta
          ? `<a href="#contacto" class="${ctaClass}" style="${ctaPad}">${esc(hospitalityCta)}</a>`
          : `<a href="#contacto" class="cua-nav-link" style="${linkStyle};font-weight:600;">${esc(brief.primaryCta)}</a>`
      }
    </nav>
  </div>
</header>`;
}

function servicesHtml(brief: CreativeBrief, dna: DesignDna, sel: CompositionSelection): string {
  const editorial =
    /legal|architecture|clinic|corporate/.test(brief.sectorId) ||
    dna.density === 'sparse' ||
    sel.featuresId === 'features-numbered-process' ||
    sel.featuresId === 'features-alternating-rows' ||
    sel.cardId === 'card-project-tile';
  const menuLed =
    sel.cardId === 'card-menu-item' ||
    brief.sectorId === 'restaurant' ||
    brief.sectorId === 'cafe' ||
    brief.sectorId === 'bakery';
  const label = brief.lang === 'es' ? (menuLed ? 'Carta' : 'Servicios') : menuLed ? 'Menu' : 'Services';
  const heading =
    brief.lang === 'es'
      ? menuLed
        ? 'Sabores y momentos'
        : 'Lo que hacemos con criterio'
      : menuLed
        ? 'Flavors and moments'
        : 'What we do with judgment';

  if (menuLed && !editorial) {
    const rows = brief.services
      .map(
        (s, i) => `<div class="cua-menu-row reveal" data-cua-comp="${sel.cardId}" style="display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:baseline;padding:1.1rem 0;border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 12%,transparent);animation-delay:${i * 55}ms">
      <div>
        <h3 style="font-family:var(--cua-font-h);margin:0;font-size:1.15rem;color:var(--cua-dark);">${esc(s)}</h3>
        <p style="margin:.35rem 0 0;color:var(--cua-muted);font-size:.9rem;max-width:42ch;">${
          brief.lang === 'es' ? 'Preparación de temporada, con producto local.' : 'Seasonal preparation with local produce.'
        }</p>
      </div>
      <span style="font-family:var(--cua-font-h);color:var(--cua-accent);letter-spacing:.04em;white-space:nowrap;">${
        brief.lang === 'es' ? 'Consultar' : 'Ask'
      }</span>
    </div>`
      )
      .join('\n');
    return `<section id="servicios" class="cua-section" data-cua-comp="${sel.featuresId}" style="padding:clamp(4.5rem,8vw,7rem) 6vw;background:var(--cua-light);">
  <div style="max-width:780px;margin:0 auto;">
    <p class="cua-kicker">${label}</p>
    <h2 class="cua-h2">${heading}</h2>
    <div style="margin-top:2rem;">${rows}</div>
  </div>
</section>`;
  }

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
    <h2 class="cua-h2" style="max-width:14ch;">${esc(brief.aboutHeadline || brief.positioning)}</h2>
    <p class="cua-lede" style="max-width:40ch;margin-top:1rem;">${esc(brief.aboutBody || brief.positioning)}</p>
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
  const isClinic = brief.sectorId === 'clinic';
  const quotes =
    brief.lang === 'es'
      ? [
          ['Excelente atención y resultado impecable.', 'Cliente verificado'],
          ['Se nota el criterio profesional en cada detalle.', 'Reseña Google'],
          [
            'Volveremos. Ambiente y calidad de primer nivel.',
            isClinic ? 'Paciente' : 'Huésped',
          ],
        ]
      : [
          ['Excellent care and impeccable result.', 'Verified client'],
          ['Professional judgment in every detail.', 'Google review'],
          [
            'We will return. Top-tier atmosphere and quality.',
            isClinic ? 'Patient' : 'Guest',
          ],
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
.cua-btn-primary{display:inline-block;background:var(--cua-accent);color:#fff;text-decoration:none;padding:.9rem 1.4rem;border-radius:var(--cua-radius);font-weight:600;border:none;cursor:pointer;font-family:var(--cua-font-b);transition:transform .28s ease,box-shadow .28s ease,filter .25s ease;}
.cua-btn-primary:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 12px 28px color-mix(in srgb,var(--cua-accent) 35%,transparent);}
.cua-btn-craft{border-radius:3px !important;letter-spacing:.08em;text-transform:uppercase;font-size:.82rem;padding:1rem 1.75rem;font-weight:600;}
.cua-btn-ghost{display:inline-block;background:transparent;color:var(--cua-dark);text-decoration:none;padding:.9rem 1.4rem;border-radius:var(--cua-radius);border:1.5px solid color-mix(in srgb,var(--cua-dark) 22%,transparent);font-weight:600;transition:transform .28s ease,border-color .25s ease;}
.cua-btn-ghost:hover{transform:translateY(-2px);border-color:var(--cua-accent);}
.cua-btn-on-dark{display:inline-block;background:transparent;color:#fff;text-decoration:none;padding:.9rem 1.4rem;border-radius:var(--cua-radius);border:1.5px solid rgba(255,255,255,.65);font-weight:600;transition:transform .28s ease,background .25s ease;}
.cua-btn-on-dark:hover{transform:translateY(-2px);background:rgba(255,255,255,.08);}
.cua-nav-link{position:relative;}
.cua-nav-link:hover{color:var(--cua-accent) !important;}
.cua-hero{position:relative;overflow:hidden;}
.cua-accent-rule{display:block;width:48px;height:2px;background:var(--cua-accent);margin-top:2rem;}
.reveal:nth-child(2){animation-delay:.12s;}
.reveal:nth-child(3){animation-delay:.22s;}
.reveal:nth-child(4){animation-delay:.32s;}
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
<main id="contenido">
${heroHtml(brief, dna, sel, imgs.hero)}
${bodySections.join('\n')}
</main>
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
