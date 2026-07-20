/**
 * Constrained Renderer — HTML bajo contrato DNA + composition.
 * Sin homogenizar a Playfair+Inter / hero 70vh universal.
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
  const bank = (IMAGE_BANK as Record<string, Record<string, unknown>>)[key] ||
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
  return '12px';
}

function heroHtml(
  brief: CreativeBrief,
  dna: DesignDna,
  sel: CompositionSelection,
  heroImg: string
): string {
  const title = esc(brief.heroTitle);
  const sub = esc(brief.heroSubtitle);
  const cta1 = esc(brief.primaryCta);
  const cta2 = esc(brief.secondaryCta);
  const name = esc(brief.businessName);
  const family = dna.heroFamily;
  const h1Size =
    dna.typography.scale === 'billboard'
      ? 'clamp(2.8rem, 7vw, 5rem)'
      : dna.typography.scale === 'intimate'
        ? 'clamp(2rem, 4vw, 3rem)'
        : 'clamp(2.4rem, 5.5vw, 4rem)';

  if (family === 'splitMediaRight' || family === 'splitMediaLeft') {
    const mediaFirst = family === 'splitMediaLeft';
    const media = `<div class="cua-hero-media" style="min-height:72vh;background:url('${heroImg}') center/cover no-repeat;" role="img" aria-label="${name}"></div>`;
    const copy = `<div class="cua-hero-copy" style="padding:clamp(3rem,8vw,6rem);display:flex;flex-direction:column;justify-content:center;background:var(--cua-light);">
      <p class="cua-eyebrow" style="letter-spacing:.18em;text-transform:uppercase;font-size:.72rem;color:var(--cua-accent);margin:0 0 1rem;">${name}</p>
      <h1 style="font-family:var(--cua-font-h);font-size:${h1Size};line-height:1.05;margin:0 0 1rem;color:var(--cua-dark);max-width:14ch;">${title}</h1>
      <p style="font-size:1.05rem;color:var(--cua-muted);max-width:36ch;margin:0 0 2rem;">${sub}</p>
      <div style="display:flex;flex-wrap:wrap;gap:.75rem;">
        <a href="#contacto" class="cua-btn-primary">${cta1}</a>
        <a href="#${sel.sectionOrder.includes('services') || sel.sectionOrder.includes('practices') || sel.sectionOrder.includes('menu') ? 'servicios' : 'nosotros'}" class="cua-btn-ghost">${cta2}</a>
      </div>
    </div>`;
    return `<section id="inicio" class="cua-hero cua-hero-split" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="display:grid;grid-template-columns:1fr 1fr;min-height:72vh;">
      ${mediaFirst ? media + copy : copy + media}
    </section>`;
  }

  if (family === 'minimalTypeOnly') {
    return `<section id="inicio" class="cua-hero cua-hero-type" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:70vh;display:flex;align-items:center;background:var(--cua-light);padding:6rem 8vw 4rem;">
      <div style="max-width:920px;">
        <p style="letter-spacing:.2em;text-transform:uppercase;font-size:.7rem;color:var(--cua-accent);">${name}</p>
        <h1 style="font-family:var(--cua-font-h);font-size:${h1Size};margin:1rem 0;color:var(--cua-dark);max-width:16ch;">${title}</h1>
        <p style="color:var(--cua-muted);max-width:40ch;font-size:1.1rem;">${sub}</p>
        <div style="margin-top:2rem;display:flex;gap:.75rem;flex-wrap:wrap;">
          <a href="#contacto" class="cua-btn-primary">${cta1}</a>
          <a href="#servicios" class="cua-btn-ghost">${cta2}</a>
        </div>
      </div>
      <div aria-hidden="true" style="position:absolute;inset:auto 0 0 auto;width:42vw;height:48vh;background:url('${heroImg}') center/cover;opacity:.35;pointer-events:none;"></div>
    </section>`;
  }

  if (family === 'editorialStack' || family === 'asymmetricOverlap') {
    return `<section id="inicio" class="cua-hero cua-hero-editorial" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="padding:5rem 6vw 3rem;background:var(--cua-light);position:relative;">
      <div style="display:grid;grid-template-columns:1.1fr .9fr;gap:2rem;align-items:end;max-width:1200px;margin:0 auto;">
        <div>
          <p style="letter-spacing:.16em;text-transform:uppercase;font-size:.7rem;color:var(--cua-accent);">${name}</p>
          <h1 style="font-family:var(--cua-font-h);font-size:${h1Size};margin:.8rem 0;color:var(--cua-dark);">${title}</h1>
          <p style="color:var(--cua-muted);max-width:34ch;">${sub}</p>
          <div style="margin-top:1.75rem;display:flex;gap:.75rem;flex-wrap:wrap;">
            <a href="#contacto" class="cua-btn-primary">${cta1}</a>
            <a href="#galeria" class="cua-btn-ghost">${cta2}</a>
          </div>
        </div>
        <div style="position:relative;min-height:420px;">
          <img src="${heroImg}" alt="${name}" data-cua-hero-bg style="width:100%;height:100%;object-fit:cover;border-radius:var(--cua-radius);box-shadow:0 30px 60px rgba(0,0,0,.18);${family === 'asymmetricOverlap' ? 'transform:translate(-8%,4%);' : ''}" />
        </div>
      </div>
    </section>`;
  }

  // fullBleedCenter / fullBleedLeft
  const align = family === 'fullBleedLeft' ? 'flex-start;text-align:left' : 'center;text-align:center';
  return `<section id="inicio" class="cua-hero cua-hero-bleed" data-cua-hero="${family}" data-cua-comp="${sel.heroId}" style="min-height:85vh;display:flex;align-items:center;justify-content:${align};background:linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,.55)),url('${heroImg}') center/cover no-repeat;color:#fff;padding:6rem 6vw;">
    <div style="max-width:820px;${family === 'fullBleedLeft' ? '' : 'margin:0 auto;'}">
      <p style="letter-spacing:.2em;text-transform:uppercase;font-size:.72rem;opacity:.9;">${name}</p>
      <h1 style="font-family:var(--cua-font-h);font-size:${h1Size};margin:1rem 0;line-height:1.05;">${title}</h1>
      <p style="font-size:1.1rem;opacity:.92;max-width:42ch;${family === 'fullBleedCenter' ? 'margin-left:auto;margin-right:auto;' : ''}">${sub}</p>
      <div style="margin-top:2rem;display:flex;gap:.75rem;flex-wrap:wrap;${family === 'fullBleedCenter' ? 'justify-content:center;' : ''}">
        <a href="#contacto" class="cua-btn-primary">${cta1}</a>
        <a href="#servicios" class="cua-btn-on-dark">${cta2}</a>
      </div>
    </div>
  </section>`;
}

function navHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const name = esc(brief.businessName);
  const links = [
    ['#inicio', brief.lang === 'es' ? 'Inicio' : 'Home'],
    ['#nosotros', brief.lang === 'es' ? 'Nosotros' : 'About'],
    ['#servicios', brief.lang === 'es' ? 'Servicios' : 'Services'],
    ['#galeria', brief.lang === 'es' ? 'Galería' : 'Gallery'],
    ['#contacto', brief.lang === 'es' ? 'Contacto' : 'Contact'],
  ];
  return `<header class="cua-nav" data-cua-comp="${sel.navId}" style="position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:color-mix(in srgb,var(--cua-surface) 88%,transparent);border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 8%,transparent);">
  <div style="max-width:1200px;margin:0 auto;padding:.9rem 6vw;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
    <a href="#inicio" style="font-family:var(--cua-font-h);font-size:1.25rem;color:var(--cua-dark);text-decoration:none;font-weight:600;">${name}</a>
    <nav aria-label="Main" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
      ${links.map(([h, l]) => `<a href="${h}" style="color:var(--cua-muted);text-decoration:none;font-size:.9rem;">${l}</a>`).join('')}
      <a href="#contacto" class="cua-btn-primary" style="padding:.55rem 1rem;font-size:.85rem;">${esc(brief.primaryCta)}</a>
    </nav>
  </div>
</header>`;
}

function servicesHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const cards = brief.services
    .map((s, i) => {
      const icon =
        brief.iconStyle === 'emoji'
          ? ['✨', '🍽️', '☕', '🎯', '🏠', '⚖️'][i % 6]
          : brief.iconStyle === 'none'
            ? ''
            : `<span style="display:inline-block;width:28px;height:2px;background:var(--cua-accent);"></span>`;
      return `<article data-cua-comp="${sel.cardId}" style="padding:1.75rem;background:var(--cua-surface);border:1px solid color-mix(in srgb,var(--cua-dark) 8%,transparent);border-radius:var(--cua-radius);">
        <div style="margin-bottom:.75rem;font-size:1.4rem;">${icon}</div>
        <h3 style="font-family:var(--cua-font-h);margin:0 0 .4rem;color:var(--cua-dark);font-size:1.15rem;">${esc(s)}</h3>
        <p style="margin:0;color:var(--cua-muted);font-size:.95rem;line-height:1.5;">${brief.lang === 'es' ? 'Diseñado para aportar valor real a tu experiencia.' : 'Designed to add real value to your experience.'}</p>
      </article>`;
    })
    .join('\n');
  const cols = brief.density === 'dense' ? 'repeat(3,1fr)' : brief.density === 'sparse' ? 'repeat(2,1fr)' : 'repeat(auto-fit,minmax(240px,1fr))';
  return `<section id="servicios" class="cua-section" data-cua-comp="${sel.featuresId}" style="padding:5rem 6vw;background:var(--cua-light);">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="letter-spacing:.16em;text-transform:uppercase;font-size:.7rem;color:var(--cua-accent);">${brief.lang === 'es' ? 'Servicios' : 'Services'}</p>
    <h2 style="font-family:var(--cua-font-h);font-size:clamp(1.8rem,3vw,2.6rem);color:var(--cua-dark);margin:.5rem 0 2rem;">${brief.lang === 'es' ? 'Lo que hacemos bien' : 'What we do best'}</h2>
    <div style="display:grid;grid-template-columns:${cols};gap:1.25rem;">${cards}</div>
  </div>
</section>`;
}

function aboutHtml(brief: CreativeBrief, sel: CompositionSelection, aboutImg: string): string {
  const flip = brief.uniquenessSeed.charCodeAt(0) % 2 === 0;
  const img = `<div style="min-height:420px;background:url('${aboutImg}') center/cover;border-radius:var(--cua-radius);"></div>`;
  const copy = `<div style="padding:1rem 0;">
    <p style="letter-spacing:.16em;text-transform:uppercase;font-size:.7rem;color:var(--cua-accent);">${brief.lang === 'es' ? 'Nosotros' : 'About'}</p>
    <h2 style="font-family:var(--cua-font-h);font-size:clamp(1.8rem,3vw,2.5rem);color:var(--cua-dark);">${esc(brief.positioning)}</h2>
    <p style="color:var(--cua-muted);line-height:1.7;max-width:42ch;">${esc(brief.audience)}. ${esc(brief.photoStyle)}.</p>
  </div>`;
  return `<section id="nosotros" class="cua-section" data-cua-comp="${sel.aboutId}" style="padding:5rem 6vw;background:var(--cua-surface);">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;">
    ${flip ? copy + img : img + copy}
  </div>
</section>`;
}

function galleryHtml(brief: CreativeBrief, sel: CompositionSelection, gallery: string[]): string {
  const imgs = gallery
    .slice(0, 6)
    .map(
      (src, i) =>
        `<img src="${src}" alt="${esc(brief.businessName)} ${i + 1}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:var(--cua-radius);" />`
    )
    .join('\n');
  return `<section id="galeria" class="cua-section" data-cua-comp="${sel.galleryId}" style="padding:5rem 6vw;background:var(--cua-light);">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-family:var(--cua-font-h);font-size:clamp(1.8rem,3vw,2.5rem);color:var(--cua-dark);margin-bottom:1.5rem;">${brief.lang === 'es' ? 'Galería' : 'Gallery'}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;grid-auto-rows:220px;">${imgs}</div>
  </div>
</section>`;
}

function whyHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const items =
    brief.lang === 'es'
      ? [
          ['Criterio', 'Decisiones con intención, no plantillas.'],
          ['Detalle', 'Cada sección tiene un solo trabajo.'],
          ['Confianza', 'Transparencia y trato profesional.'],
        ]
      : [
          ['Judgment', 'Intentional decisions, not templates.'],
          ['Detail', 'Each section has one job.'],
          ['Trust', 'Transparency and professional care.'],
        ];
  return `<section id="por-que" class="cua-section" data-cua-comp="${sel.featuresId}" style="padding:5rem 6vw;background:var(--cua-dark);color:#fff;">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-family:var(--cua-font-h);font-size:clamp(1.8rem,3vw,2.5rem);margin-bottom:2rem;">${brief.lang === 'es' ? 'Por qué elegirnos' : 'Why us'}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">
      ${items
        .map(
          ([t, p]) =>
            `<div style="padding:1.5rem;border:1px solid rgba(255,255,255,.12);border-radius:var(--cua-radius);"><h3 style="margin:0 0 .5rem;color:var(--cua-accent);">${t}</h3><p style="margin:0;opacity:.85;">${p}</p></div>`
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
          ['Volveremos. Ambiente y calidad de primer nivel.', 'Huésped / paciente'],
        ]
      : [
          ['Excellent care and impeccable result.', 'Verified client'],
          ['Professional judgment in every detail.', 'Google review'],
          ['We will return. Top-tier atmosphere and quality.', 'Guest'],
        ];
  return `<section id="opiniones" class="cua-section" data-cua-comp="${sel.testimonialId}" style="padding:5rem 6vw;background:var(--cua-surface);">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-family:var(--cua-font-h);color:var(--cua-dark);margin-bottom:1.5rem;">${brief.lang === 'es' ? 'Opiniones' : 'Testimonials'}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;">
      ${quotes
        .map(
          ([q, a]) =>
            `<blockquote style="margin:0;padding:1.5rem;background:var(--cua-light);border-radius:var(--cua-radius);border-left:3px solid var(--cua-accent);"><p style="color:var(--cua-dark);line-height:1.6;">“${q}”</p><footer style="margin-top:1rem;color:var(--cua-muted);font-size:.85rem;">— ${a}</footer></blockquote>`
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
          ['¿Qué incluye el servicio?', 'Te lo detallamos en la primera conversación, sin letra pequeña.'],
        ]
      : [
          ['How do I book?', 'Use the contact form or the primary hero button.'],
          ['Where are you?', brief.address || 'See the contact section.'],
          ['What is included?', 'We clarify scope in the first conversation.'],
        ];
  return `<section id="faq" class="cua-section" data-cua-comp="${sel.faqId}" style="padding:4rem 6vw;background:var(--cua-light);">
  <div style="max-width:800px;margin:0 auto;">
    <h2 style="font-family:var(--cua-font-h);color:var(--cua-dark);">FAQ</h2>
    ${faqs
      .map(
        ([q, a]) =>
          `<details style="border-bottom:1px solid color-mix(in srgb,var(--cua-dark) 10%,transparent);padding:1rem 0;"><summary style="cursor:pointer;font-weight:600;color:var(--cua-dark);">${esc(q)}</summary><p style="color:var(--cua-muted);margin:.75rem 0 0;">${esc(a)}</p></details>`
      )
      .join('')}
  </div>
</section>`;
}

function contactHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  return `<section id="contacto" class="cua-section" data-cua-comp="${sel.formId}" style="padding:5rem 6vw;background:var(--cua-surface);">
  <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;">
    <div>
      <h2 style="font-family:var(--cua-font-h);color:var(--cua-dark);">${brief.lang === 'es' ? 'Contacto' : 'Contact'}</h2>
      <p style="color:var(--cua-muted);">${esc(brief.address || (brief.lang === 'es' ? 'Escríbenos y te respondemos pronto.' : 'Write to us and we will reply soon.'))}</p>
      ${brief.hours ? `<p style="color:var(--cua-muted);">${esc(brief.hours)}</p>` : ''}
      <a href="#contacto" class="cua-btn-primary" data-cua-comp="${sel.ctaId}" style="display:inline-block;margin-top:1rem;">${esc(brief.primaryCta)}</a>
    </div>
    <form style="display:grid;gap:.75rem;" onsubmit="return false;">
      <label style="display:grid;gap:.35rem;color:var(--cua-muted);font-size:.85rem;">${brief.lang === 'es' ? 'Nombre' : 'Name'}<input required name="name" style="padding:.75rem 1rem;border:1px solid color-mix(in srgb,var(--cua-dark) 15%,transparent);border-radius:var(--cua-radius);background:var(--cua-light);" /></label>
      <label style="display:grid;gap:.35rem;color:var(--cua-muted);font-size:.85rem;">Email<input required type="email" name="email" style="padding:.75rem 1rem;border:1px solid color-mix(in srgb,var(--cua-dark) 15%,transparent);border-radius:var(--cua-radius);background:var(--cua-light);" /></label>
      <label style="display:grid;gap:.35rem;color:var(--cua-muted);font-size:.85rem;">${brief.lang === 'es' ? 'Mensaje' : 'Message'}<textarea name="msg" rows="4" style="padding:.75rem 1rem;border:1px solid color-mix(in srgb,var(--cua-dark) 15%,transparent);border-radius:var(--cua-radius);background:var(--cua-light);"></textarea></label>
      <button type="submit" class="cua-btn-primary">${esc(brief.primaryCta)}</button>
    </form>
  </div>
</section>`;
}

function footerHtml(brief: CreativeBrief, sel: CompositionSelection): string {
  const name = esc(brief.businessName);
  return `<footer class="cua-footer" data-cua-comp="${sel.footerId}" style="padding:3rem 6vw;background:var(--cua-dark);color:rgba(255,255,255,.8);">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:1.5rem;">
    <div><strong style="font-family:var(--cua-font-h);color:#fff;font-size:1.2rem;">${name}</strong><p style="margin:.5rem 0 0;max-width:36ch;opacity:.75;">${esc(brief.positioning)}</p></div>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
      <button type="button" onclick="openModal('aviso')" style="background:none;border:none;color:inherit;cursor:pointer;text-decoration:underline;">${brief.lang === 'es' ? 'Aviso legal' : 'Legal'}</button>
      <button type="button" onclick="openModal('privacidad')" style="background:none;border:none;color:inherit;cursor:pointer;text-decoration:underline;">${brief.lang === 'es' ? 'Privacidad' : 'Privacy'}</button>
      <button type="button" onclick="openModal('cookies')" style="background:none;border:none;color:inherit;cursor:pointer;text-decoration:underline;">Cookies</button>
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
  if (k.includes('service') || k.includes('menu') || k.includes('practice') || k.includes('product') || k.includes('room') || k.includes('treatment'))
    return servicesHtml(brief, sel);
  if (k.includes('about') || k.includes('nosotros') || k.includes('philosophy') || k.includes('studio') || k.includes('trust') || k.includes('position') || k.includes('atmosphere'))
    return aboutHtml(brief, sel, imgs.about);
  if (k.includes('galer') || k.includes('gallery') || k.includes('lookbook') || k.includes('project'))
    return galleryHtml(brief, sel, imgs.gallery);
  if (k.includes('why') || k.includes('por') || k.includes('experience') || k.includes('method') || k.includes('process'))
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
  if (!seen.has('servicios')) bodySections.unshift(servicesHtml(brief, sel));
  if (!seen.has('nosotros')) bodySections.splice(1, 0, aboutHtml(brief, sel, imgs.about));
  if (!seen.has('galeria')) bodySections.push(galleryHtml(brief, sel, imgs.gallery));
  if (!seen.has('contacto')) bodySections.push(contactHtml(brief, sel));

  const title = `${esc(brief.businessName)} | ${esc(brief.positioning).slice(0, 60)}`;
  const desc = esc(brief.heroSubtitle);

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
:root{${cssVars};--cua-font-h:'${dna.typography.heading}',serif;--cua-font-b:'${dna.typography.body}',system-ui,sans-serif;--cua-radius:${radiusCss(dna.radius)};}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:var(--cua-font-b);background:var(--cua-light);color:var(--cua-dark);line-height:1.5;}
img{max-width:100%;display:block;}
.cua-btn-primary{display:inline-block;background:var(--cua-accent);color:#fff;text-decoration:none;padding:.85rem 1.35rem;border-radius:var(--cua-radius);font-weight:600;border:none;cursor:pointer;font-family:var(--cua-font-b);}
.cua-btn-ghost{display:inline-block;background:transparent;color:var(--cua-dark);text-decoration:none;padding:.85rem 1.35rem;border-radius:var(--cua-radius);border:1px solid color-mix(in srgb,var(--cua-dark) 20%,transparent);font-weight:600;}
.cua-btn-on-dark{display:inline-block;background:transparent;color:#fff;text-decoration:none;padding:.85rem 1.35rem;border-radius:var(--cua-radius);border:1px solid rgba(255,255,255,.5);font-weight:600;}
.cua-hero{position:relative;overflow:hidden;}
@media (max-width:900px){
  .cua-hero-split{grid-template-columns:1fr !important;}
  .cua-hero-editorial > div{grid-template-columns:1fr !important;}
  #contacto > div,#nosotros > div,#servicios .cua-section{grid-template-columns:1fr !important;}
  #servicios div[style*="grid-template-columns"],#galeria div[style*="grid-template-columns"],#opiniones div[style*="grid-template-columns"],#por-que div[style*="grid-template-columns"],#contacto > div{grid-template-columns:1fr !important;}
}
</style>
<meta name="creauna-dna" content="${esc(dna.id)}" />
<meta name="creauna-layout" content="${esc(sel.layout.id)}" />
<meta name="creauna-seed" content="${esc(brief.uniquenessSeed)}" />
<meta name="creauna-sector" content="${esc(brief.sectorId)}" />
</head>
<body data-cua-creative="1" data-cua-dna="${esc(dna.id)}" data-cua-layout="${esc(sel.layout.id)}">
${navHtml(brief, sel)}
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
