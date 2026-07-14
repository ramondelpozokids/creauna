import type {
  BusinessInfoSection,
  DailyMenuCard,
  DigitalServicesContent,
  FootballFeature,
  FootballSectionContent,
  GalleryImage,
  MenuCategory,
  MenuHighlight,
  MenuItem,
  PremiumStarterContent,
  ReviewCard,
} from './premiumContentTypes';
import { emptyPremiumContent, slugifyId } from './premiumContentTypes';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function galleryLightboxUrl(url: string): string {
  return url.replace(/w=\d+/g, 'w=1200').replace(/h=\d+/g, 'h=900');
}

function galleryGridUrl(url: string): string {
  if (/w=\d+/.test(url)) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}w=800&h=600&fit=crop`;
}

function parseMenuItem(block: string, index: number): MenuItem {
  const name = block.match(/<h4>([^<]*)<\/h4>/)?.[1]?.trim() ?? '';
  const description = block.match(/<p>([^<]*)<\/p>/)?.[1]?.trim();
  const price = block.match(/<div class="menu-item-price">([^<]*)<\/div>/)?.[1]?.trim();
  return {
    id: slugifyId(`${name}-${index}`),
    name,
    description: description || undefined,
    price: price || undefined,
  };
}

function parseHighlight(block: string, index: number): MenuHighlight {
  const icon = block.match(/<i class="([^"]+)">/)?.[1] ?? 'fas fa-utensils';
  const title = block.match(/<i class="[^"]+"><\/i>\s*([^<]*)<\/h4>/)?.[1]?.trim() ?? '';
  const description = block.match(/<p>([^<]*)<\/p>/)?.[1]?.trim() ?? '';
  return { id: slugifyId(`highlight-${index}`), icon, title, description };
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function htmlToLines(html: string): string[] {
  return html
    .split(/<br\s*\/?>/i)
    .map(stripTags)
    .filter(Boolean);
}

function parseFootballFeature(block: string, index: number): FootballFeature {
  const icon = block.match(/<i class="([^"]+)">/)?.[1] ?? 'fas fa-futbol';
  const title = block.match(/<h3>([^<]*)<\/h3>/)?.[1]?.trim() ?? '';
  const description = block.match(/<p>([^<]*)<\/p>/)?.[1]?.trim() ?? '';
  return { id: slugifyId(`football-${index}`), icon, title, description };
}

function parseInfoCards(html: string): BusinessInfoSection {
  const grid = html.match(/<section id="info">[\s\S]*?<div class="info-grid">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const cards = grid.split(/<div class="info-card-premium">/).slice(1);
  const defaults = emptyPremiumContent().info;

  const locationBody = cards[0]?.match(/<h3>Ubicación<\/h3><p>([\s\S]*?)<\/p>/)?.[1] ?? '';
  const locationLink =
    cards[0]?.match(/<a[^>]*>([\s\S]*?)<\/a>/)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? defaults.locationLinkText;

  const hoursBody = cards[1]?.match(/<h3>Horario<\/h3><p>([\s\S]*?)<\/p>/)?.[1] ?? '';
  const hoursStatusOpen = cards[1]?.includes('status-badge open') ?? true;
  const hoursStatusText =
    cards[1]?.match(/status-badge[^>]*>([\s\S]*?)<\/span>/)?.[1]?.replace(/<[^>]+>/g, '').trim() ??
    defaults.hoursStatusText;

  const pricesBody = cards[2]?.match(/<h3>Precios<\/h3><p>([\s\S]*?)<\/p>/)?.[1] ?? '';
  const specialtiesBody = cards[3]?.match(/<h3>Especialidades<\/h3><p>([\s\S]*?)<\/p>/)?.[1] ?? '';
  const specialtyItems = specialtiesBody
    .split(/<br\s*\/?>/i)
    .map(stripTags)
    .filter(Boolean);

  return {
    locationLines: htmlToLines(locationBody),
    locationLinkText: locationLink,
    hoursLines: htmlToLines(hoursBody),
    hoursStatusOpen,
    hoursStatusText,
    priceLines: htmlToLines(pricesBody),
    specialtyItems,
  };
}

function parseFootballSection(html: string): FootballSectionContent {
  const block = html.match(/<section id="futbol"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  const defaults = emptyPremiumContent().football;
  const headline = block.match(/<h2>([^<]*)<\/h2>/)?.[1]?.trim() ?? defaults.headline;
  const introPrefix =
    block.match(/<p>Ven a vivir el fútbol en/)?.[0] ?
      'Ven a vivir el fútbol en'
      : block.match(/<p>([^<]*)<span class="highlight">/)?.[1]?.trim() ?? defaults.introPrefix;
  const highlightName =
    block.match(/<span class="highlight">([^<]*)<\/span>/)?.[1]?.trim() ?? defaults.highlightName;
  const tagline =
    block.match(/<strong>([^<]*)<\/strong>/)?.[1]?.trim() ?? defaults.tagline;
  const ctaText =
    block.match(/<a href="#reservas"[^>]*>[\s\S]*?<\/i>\s*([^<]*)<\/a>/)?.[1]?.trim() ?? defaults.ctaText;

  const features: FootballFeature[] = [];
  const featureRegex = /<div class="football-feature">([\s\S]*?)<\/div>/g;
  let featureMatch: RegExpExecArray | null;
  let featureIndex = 0;
  while ((featureMatch = featureRegex.exec(block)) !== null) {
    features.push(parseFootballFeature(featureMatch[1], featureIndex++));
  }

  return { headline, introPrefix, highlightName, tagline, features, ctaText };
}

function parseStarCount(block: string): number {
  const full = (block.match(/class="fas fa-star"/g) ?? []).length;
  const half = block.includes('fa-star-half-alt') ? 0.5 : 0;
  return Math.min(5, full + half);
}

function parseReviewCard(block: string, index: number): ReviewCard {
  const initials = block.match(/<div class="reviewer-avatar">([^<]*)<\/div>/)?.[1]?.trim() ?? 'CL';
  const author = block.match(/<div class="reviewer-details"><h4>([^<]*)<\/h4>/)?.[1]?.trim() ?? '';
  const badge = block.match(/<span class="badge">([^<]*)<\/span>/)?.[1]?.trim() ?? 'Cliente';
  const date = block.match(/<p class="review-date">([^<]*)<\/p>/)?.[1]?.trim() ?? '';
  const text = block.match(/<p class="review-text">([^<]*)<\/p>/)?.[1]?.trim() ?? '';
  return {
    id: slugifyId(`review-${index}-${author}`),
    author,
    badge,
    initials,
    stars: parseStarCount(block),
    date,
    text,
  };
}

function parseDigitalServices(html: string): DigitalServicesContent {
  const defaults = emptyPremiumContent().digital;
  const hero = html.match(/<div class="hero-trust-badges" id="hero-trust">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const googleRating = hero.match(/<strong>([\d,.]+)<\/strong>/)?.[1]?.trim() ?? defaults.googleRating;
  const googleReviewCount =
    hero.match(/\((\d+)\s*reseñas/i)?.[1]?.trim() ?? defaults.googleReviewCount;
  const badge24hText =
    hero.match(/<div class="badge-24h">[\s\S]*?<\/div>/)?.[0]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ??
    defaults.badge24hText;

  const carta = html.match(/<section id="carta-digital">([\s\S]*?)<\/section>/)?.[1] ?? '';
  const qrHeadline = carta.match(/<div class="qr-text"><h4>([^<]*)<\/h4>/)?.[1]?.trim() ?? defaults.qrHeadline;
  const qrSubtitle = carta.match(/<div class="qr-text"><h4>[^<]*<\/h4><p>([^<]*)<\/p>/)?.[1]?.trim() ?? defaults.qrSubtitle;
  const qrImg = carta.match(/<img src="([^"]+create-qr-code[^"]+)"/)?.[1] ?? '';
  const qrTargetMatch = qrImg.match(/data=([^&"]+)/);
  const qrTargetUrl = qrTargetMatch ? decodeURIComponent(qrTargetMatch[1]) : defaults.qrTargetUrl;
  const qrFeatures: string[] = [];
  const qrFeatureRegex = /<div class="digital-menu-features">[\s\S]*?<ul>([\s\S]*?)<\/ul>/;
  const qrFeatureBlock = carta.match(qrFeatureRegex)?.[1] ?? '';
  qrFeatureBlock.split(/<li>/).slice(1).forEach((chunk) => {
    const text = stripTags(chunk);
    if (text) qrFeatures.push(text);
  });

  const reservas = html.match(/<section id="reservas">([\s\S]*?)<\/section>/)?.[1] ?? '';
  const reservaBannerTitle =
    reservas.match(/<div class="reserva-24-banner">[\s\S]*?<strong>([^<]*)<\/strong>/)?.[1]?.trim() ??
    defaults.reservaBannerTitle;
  const reservaBannerText =
    reservas.match(/<div class="reserva-24-banner">[\s\S]*?<p>([^<]*)<\/p>/)?.[1]?.trim() ??
    defaults.reservaBannerText;
  const reservaFeatures: string[] = [];
  const bookingFeatures = reservas.match(/<ul class="booking-features">([\s\S]*?)<\/ul>/)?.[1] ?? '';
  bookingFeatures.split(/<li>/).slice(1).forEach((chunk) => {
    const text = stripTags(chunk);
    if (text) reservaFeatures.push(text);
  });

  const resenas = html.match(/<section id="reseñas">([\s\S]*?)<\/section>/)?.[1] ?? '';
  const reviewsHeadline =
    resenas.match(/<h2 class="section-title">([^<]*)<\/h2>/)?.[1]?.trim() ?? defaults.reviewsHeadline;
  const reviewsSubtitle =
    resenas.match(/<p class="section-subtitle">([^<]*)<\/p>/)?.[1]?.trim() ?? defaults.reviewsSubtitle;
  const googleMapsUrl =
    resenas.match(/class="google-reviews-cta"[\s\S]*?href="([^"]+)"/)?.[1] ?? defaults.googleMapsUrl;

  const reviews: ReviewCard[] = [];
  const reviewChunks = resenas.split('<div class="review-card-premium">').slice(1);
  reviewChunks.forEach((chunk, index) => {
    const body = chunk.split('<div class="google-reviews-cta">')[0]?.split('</div>\n        <div class="review-card-premium">')[0] ?? chunk;
    reviews.push(parseReviewCard(body, index));
  });

  const orderingEnabled = carta.includes('table-ordering-block');
  const mesaMatches = [...carta.matchAll(/pedir\.html\?mesa=(\d+)/g)];
  const tableCount = mesaMatches.length
    ? Math.max(...mesaMatches.map((m) => Number(m[1])))
    : defaults.tableCount;
  const tableSectionHeadline =
    carta.match(/<h3 class="table-order-headline">([^<]*)<\/h3>/)?.[1]?.trim() ?? defaults.tableSectionHeadline;
  const tableSectionSubtitle =
    carta.match(/<p class="table-order-subtitle">([^<]*)<\/p>/)?.[1]?.trim() ?? defaults.tableSectionSubtitle;

  return {
    googleRating,
    googleReviewCount,
    badge24hText: badge24hText.replace(/\s+/g, ' ').trim(),
    qrHeadline,
    qrSubtitle,
    qrTargetUrl,
    qrFeatures: qrFeatures.length ? qrFeatures : defaults.qrFeatures,
    reservaBannerTitle,
    reservaBannerText,
    reservaFeatures: reservaFeatures.length ? reservaFeatures : defaults.reservaFeatures,
    reviewsHeadline,
    reviewsSubtitle,
    reviews: reviews.length ? reviews : defaults.reviews,
    googleMapsUrl,
    orderingEnabled: carta.includes('table-ordering-block') || defaults.orderingEnabled,
    tableCount,
    tableSectionHeadline,
    tableSectionSubtitle,
    orderSendButtonText: defaults.orderSendButtonText,
  };
}

function buildStarsHtml(stars: number): string {
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
  return html;
}

function buildQrImageUrl(targetUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`;
}

function buildHeroTrustHtml(digital: DigitalServicesContent): string {
  const rating = parseFloat(digital.googleRating.replace(',', '.')) || 4;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
  if (half || (rating % 1 >= 0.75 && full < 5)) stars += '<i class="fas fa-star-half-alt"></i>';
  const badgeText = digital.badge24hText.replace(/\s*24h?\s*$/i, '').trim() || 'Reserva online';
  return `<div class="hero-trust-badges" id="hero-trust">
        <div class="rating-badge"><span class="stars"><i class="fab fa-google"></i> ${stars}</span><strong>${escapeHtml(digital.googleRating)}</strong><span>(${escapeHtml(digital.googleReviewCount)} reseñas Google)</span></div>
        <div class="badge-24h"><i class="fas fa-clock"></i> ${escapeHtml(badgeText)} <strong>24h</strong></div>
      </div>`;
}

function buildReviewCardHtml(review: ReviewCard): string {
  return `<div class="review-card-premium">
          <div class="review-header"><div class="reviewer-info"><div class="reviewer-avatar">${escapeHtml(review.initials)}</div><div class="reviewer-details"><h4>${escapeHtml(review.author)}</h4><span class="badge">${escapeHtml(review.badge)}</span></div></div><div class="review-rating">${buildStarsHtml(review.stars)}</div></div>
          <p class="review-date">${escapeHtml(review.date)}</p>
          <p class="review-text">${escapeHtml(review.text)}</p>
        </div>`;
}

function buildTableMesaGrid(count: number): string {
  const buttons: string[] = [];
  for (let i = 1; i <= count; i++) {
    buttons.push(
      `<a href="pedir.html?mesa=${i}" class="table-mesa-btn" title="Mesa ${i}">${i}</a>`
    );
  }
  return buttons.join('\n            ');
}

function buildTableQrPrintGrid(count: number, pageOrigin: string): string {
  const cards: string[] = [];
  for (let i = 1; i <= count; i++) {
    const url = `${pageOrigin}pedir.html?mesa=${i}`;
    cards.push(
      `<div class="table-qr-card"><img src="${escapeHtml(buildQrImageUrl(url))}" alt="QR Mesa ${i}" width="120" height="120"><span>Mesa ${i}</span></div>`
    );
  }
  return cards.join('\n          ');
}

function buildCartaDigitalSectionHtml(digital: DigitalServicesContent): string {
  const features = digital.qrFeatures
    .map((f) => `<li><i class="fas fa-check-circle"></i> ${escapeHtml(f)}</li>`)
    .join('\n            ');
  const qrUrl = digital.orderingEnabled ? 'pedir.html?mesa=1' : digital.qrTargetUrl;
  const orderingBlock = digital.orderingEnabled
    ? `<div class="table-ordering-block">
        <h3 class="table-order-headline">${escapeHtml(digital.tableSectionHeadline)}</h3>
        <p class="table-order-subtitle">${escapeHtml(digital.tableSectionSubtitle)}</p>
        <div class="table-mesa-grid">
            ${buildTableMesaGrid(Math.max(1, digital.tableCount))}
        </div>
        <details class="table-qr-print-details">
          <summary><i class="fas fa-print"></i> Códigos QR por mesa (para imprimir)</summary>
          <div class="table-qr-print-grid">
          ${buildTableQrPrintGrid(Math.max(1, digital.tableCount), '')}
          </div>
        </details>
        <p class="table-order-footnote"><a href="pedir.html"><i class="fas fa-utensils"></i> Ver carta para pedir sin asignar mesa</a></p>
      </div>`
    : '';
  return `<section id="carta-digital">
      <div class="section-header"><h2 class="section-title">Carta Digital</h2><p class="section-subtitle">Escanea el QR y ${digital.orderingEnabled ? 'pide desde tu mesa' : 'consulta nuestra carta desde tu móvil'}</p></div>
      <div class="digital-menu-grid">
        <div class="qr-section">
          <div class="qr-container">
            <div class="qr-code"><img src="${escapeHtml(buildQrImageUrl(qrUrl))}" alt="QR Carta digital" width="200" height="200"></div>
            <div class="qr-text"><h4>${escapeHtml(digital.qrHeadline)}</h4><p>${escapeHtml(digital.qrSubtitle)}</p></div>
          </div>
        </div>
        <div class="digital-menu-features">
          <h3>Tu carta, en el móvil del cliente</h3>
          <ul>
            ${features}
          </ul>
          <div style="margin-top: 1.5rem;"><a href="${digital.orderingEnabled ? 'pedir.html' : '#menu'}" class="btn btn-primary"><i class="fas fa-${digital.orderingEnabled ? 'shopping-basket' : 'utensils'}"></i> ${digital.orderingEnabled ? 'Pedir ahora' : 'Ver carta completa'}</a></div>
        </div>
      </div>
      ${orderingBlock}
    </section>`;
}

function buildResenasSectionHtml(digital: DigitalServicesContent): string {
  const cards = digital.reviews.map(buildReviewCardHtml).join('\n        ');
  return `<section id="reseñas">
      <div class="section-header"><h2 class="section-title">${escapeHtml(digital.reviewsHeadline)}</h2><p class="section-subtitle">${escapeHtml(digital.reviewsSubtitle)}</p></div>
      <div class="reviews-grid">
        ${cards}
      </div>
      <div class="google-reviews-cta"><a href="${escapeHtml(digital.googleMapsUrl)}" target="_blank" rel="noopener noreferrer" class="btn"><i class="fab fa-google"></i> Ver todas las reseñas en Google</a></div>
    </section>`;
}

function buildReservaDigitalPatch(digital: DigitalServicesContent): {
  banner: string;
  features: string;
} {
  const features = digital.reservaFeatures
    .map((f) => `<li><i class="fas fa-check-circle"></i> ${escapeHtml(f)}</li>`)
    .join('\n              ');
  const banner = `<div class="reserva-24-banner"><i class="fas fa-moon"></i><div><strong>${escapeHtml(digital.reservaBannerTitle)}</strong><p>${escapeHtml(digital.reservaBannerText)}</p></div></div>`;
  return { banner, features: `<ul class="booking-features">\n              ${features}\n            </ul>` };
}

function parseDailyMenuCard(block: string, index: number): DailyMenuCard {
  const icon = block.match(/<i class="([^"]+)">/)?.[1] ?? 'fas fa-calendar-day';
  const title = block.match(/<i class="[^"]+"><\/i>\s*([^<]*)<\/h4>/)?.[1]?.trim() ?? '';
  const price =
    block.match(/<p style="font-size: 2rem[^"]*">([^<]*)<\/p>/)?.[1]?.trim() ??
    block.match(/<p[^>]*>([\d,.]+\s*€)<\/p>/)?.[1]?.trim() ??
    '';
  const scheduleTitle = block.match(/<strong>([^<]*)<\/strong>/)?.[1]?.trim() ?? '';
  const scheduleDetail = block.match(/<strong>[^<]*<\/strong><br>\s*([^<]*)/)?.[1]?.trim() ?? '';
  const items: string[] = [];
  const liRegex = /<li>([^<]*)<\/li>/g;
  let liMatch: RegExpExecArray | null;
  while ((liMatch = liRegex.exec(block)) !== null) {
    const text = liMatch[1].trim();
    if (text) items.push(text);
  }
  return {
    id: slugifyId(`daily-${index}-${title}`),
    icon,
    title,
    price,
    scheduleTitle,
    scheduleDetail,
    items,
  };
}

/** Extrae carta, destacados, menús del día y galería del HTML de Mesón La Colonia. */
export function extractMesonContent(html: string): PremiumStarterContent {
  const menu: MenuCategory[] = [];
  const menuSection = html.match(/<section id="menu">([\s\S]*?)<\/section>/)?.[1] ?? '';

  const tabMeta = new Map<string, { icon: string; name: string }>();
  const tabRegex =
    /<button class="menu-tab[^"]*" data-category="([^"]+)"[^>]*><i class="([^"]+)"[^>]*><\/i>\s*([^<\n]+?)\s*<span class="count">\d+<\/span><\/button>/g;
  let tabMatch: RegExpExecArray | null;
  while ((tabMatch = tabRegex.exec(menuSection)) !== null) {
    tabMeta.set(tabMatch[1], { icon: tabMatch[2], name: tabMatch[3].trim() });
  }

  const categoryChunks = menuSection.split(/<div class="menu-category[^"]*"\s+id="/);
  for (let i = 1; i < categoryChunks.length; i++) {
    const chunk = categoryChunks[i];
    const idEnd = chunk.indexOf('"');
    if (idEnd < 0) continue;
    const id = chunk.slice(0, idEnd);
    const body = chunk.slice(idEnd + 2);
    const title =
      body.match(/<h3 class="category-title">([^<]*)<\/h3>/)?.[1]?.trim() ??
      tabMeta.get(id)?.name ??
      id;
    const items: MenuItem[] = [];
    const itemParts = body.split('<div class="menu-item-card">').slice(1);
    let itemIndex = 0;
    for (const raw of itemParts) {
      const stopMarkers = ['</div>\n            </div>', '</div>\n          </div>', '<div class="menu-category"'];
      let part = raw;
      for (const marker of stopMarkers) {
        const idx = part.indexOf(marker);
        if (idx >= 0) {
          part = part.slice(0, idx);
          break;
        }
      }
      if (part.trim()) {
        items.push(parseMenuItem(part, itemIndex++));
      }
    }
    menu.push({
      id,
      name: title,
      icon: tabMeta.get(id)?.icon ?? 'fas fa-utensils',
      items,
    });
  }

  const highlights: MenuHighlight[] = [];
  const highlightsGrid = html.match(/<div class="menu-highlight-grid">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const highlightRegex = /<div class="menu-highlight-card">([\s\S]*?)<\/div>/g;
  let highlightMatch: RegExpExecArray | null;
  let highlightIndex = 0;
  while ((highlightMatch = highlightRegex.exec(highlightsGrid)) !== null) {
    highlights.push(parseHighlight(highlightMatch[1], highlightIndex++));
  }

  const dailyMenus: DailyMenuCard[] = [];
  const dailyGrid =
    html.match(/<div class="menu-grid-daily">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>\s*<section id="menu">/)?.[1] ??
    html.match(/<div class="menu-grid-daily">([\s\S]*?)<\/div>/)?.[1] ??
    '';
  const dailyChunks = dailyGrid.split(/<div class="menu-category-daily">/).slice(1);
  dailyChunks.forEach((chunk, index) => {
    dailyMenus.push(parseDailyMenuCard(chunk, index));
  });

  const gallery: GalleryImage[] = [];
  const gallerySection = html.match(/<div class="gallery-grid">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const imgRegex = /<img src="([^"]+)" alt="([^"]*)"/g;
  let imgMatch: RegExpExecArray | null;
  let imgIndex = 0;
  while ((imgMatch = imgRegex.exec(gallerySection)) !== null) {
    gallery.push({
      id: slugifyId(`gallery-${imgIndex}`),
      url: imgMatch[1],
      alt: imgMatch[2],
    });
    imgIndex += 1;
  }

  return { menu, highlights, dailyMenus, info: parseInfoCards(html), football: parseFootballSection(html), digital: parseDigitalServices(html), gallery };
}

function buildMenuItemHtml(item: MenuItem): string {
  const name = escapeHtml(item.name);
  const desc = item.description?.trim()
    ? `<p>${escapeHtml(item.description.trim())}</p>`
    : '';
  const price = item.price?.trim()
    ? `<div class="menu-item-price">${escapeHtml(item.price.trim())}</div>`
    : '';
  return `<div class="menu-item-card"><div class="menu-item-info"><h4>${name}</h4>${desc}</div>${price}</div>`;
}

function buildMenuCategoryHtml(category: MenuCategory, active: boolean): string {
  const items = category.items.map(buildMenuItemHtml).join('\n              ');
  return `<div class="menu-category${active ? ' active' : ''}" id="${escapeHtml(category.id)}">
            <div class="category-header"><div class="category-icon"><i class="${category.icon}"></i></div><h3 class="category-title">${escapeHtml(category.name)}</h3></div>
            <div class="menu-grid">
              ${items}
            </div>
          </div>`;
}

function buildMenuTabsHtml(categories: MenuCategory[]): string {
  return categories
    .map(
      (cat, i) =>
        `<button class="menu-tab${i === 0 ? ' active' : ''}" data-category="${escapeHtml(cat.id)}"><i class="${cat.icon}"></i> ${escapeHtml(cat.name)} <span class="count">${cat.items.length}</span></button>`
    )
    .join('\n          ');
}

function buildMenuSectionHtml(categories: MenuCategory[]): string {
  const tabs = buildMenuTabsHtml(categories);
  const content = categories.map((cat, i) => buildMenuCategoryHtml(cat, i === 0)).join('\n          ');
  return `<section id="menu">
      <div class="section-header"><h2 class="section-title">Nuestra Carta</h2><p class="section-subtitle">Descubre nuestra amplia variedad de platos</p></div>
      <div class="menu-container">
        <div class="menu-tabs">
          ${tabs}
        </div>
        <div class="menu-content">
          ${content}
        </div>
      </div>
    </section>`;
}

function buildHighlightCardHtml(h: MenuHighlight): string {
  return `<div class="menu-highlight-card"><h4><i class="${h.icon}"></i> ${escapeHtml(h.title)}</h4><p>${escapeHtml(h.description)}</p></div>`;
}

function buildHighlightsSectionHtml(highlights: MenuHighlight[]): string {
  const cards = highlights.map(buildHighlightCardHtml).join('\n        ');
  return `<section id="destacados">
      <div class="section-header"><h2 class="section-title">Destacados del Menú</h2><p class="section-subtitle">Nuestras especialidades más populares</p></div>
      <div class="menu-highlight-grid">
        ${cards}
      </div>
    </section>`;
}

function buildDailyMenuCardHtml(card: DailyMenuCard): string {
  const items = card.items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  return `<div class="menu-category-daily"><h4><i class="${card.icon}"></i> ${escapeHtml(card.title)}</h4><p style="font-size: 2rem; color: var(--color-accent); font-weight: 700; margin: 1rem 0;">${escapeHtml(card.price)}</p><p><strong>${escapeHtml(card.scheduleTitle)}</strong><br>${escapeHtml(card.scheduleDetail)}</p><ul style="margin-top: 1.5rem;">${items}</ul></div>`;
}

function buildInfoSectionHtml(info: BusinessInfoSection): string {
  const location = info.locationLines.map(escapeHtml).join('<br>');
  const hours = info.hoursLines.map((line) => escapeHtml(line)).join('<br>');
  const prices = info.priceLines.map((line) => escapeHtml(line)).join('<br>');
  const specialties = info.specialtyItems
    .map(
      (item) =>
        `<i class="fas fa-check" style="color: var(--color-accent); margin-right: 0.5rem;"></i> ${escapeHtml(item)}`
    )
    .join('<br>');
  const statusClass = info.hoursStatusOpen ? 'open' : 'closed';
  const statusIcon = info.hoursStatusOpen ? 'fa-check-circle' : 'fa-times-circle';

  return `<section id="info">
      <div class="section-header"><h2 class="section-title">Información</h2><p class="section-subtitle">Todo lo que necesitas saber sobre nosotros</p></div>
      <div class="info-grid">
        <div class="info-card-premium"><div class="info-icon"><i class="fas fa-map-marker-alt"></i></div><h3>Ubicación</h3><p>${location}</p><a href="#ubicacion" style="margin-top: 1rem; display: inline-block;"><i class="fas fa-directions"></i> ${escapeHtml(info.locationLinkText)}</a></div>
        <div class="info-card-premium"><div class="info-icon"><i class="fas fa-clock"></i></div><h3>Horario</h3><p>${hours}</p><span class="status-badge ${statusClass}"><i class="fas ${statusIcon}"></i> ${escapeHtml(info.hoursStatusText)}</span></div>
        <div class="info-card-premium"><div class="info-icon"><i class="fas fa-euro-sign"></i></div><h3>Precios</h3><p>${prices}</p></div>
        <div class="info-card-premium"><div class="info-icon"><i class="fas fa-concierge-bell"></i></div><h3>Especialidades</h3><p>${specialties}</p></div>
      </div>
    </section>`;
}

function buildFootballFeatureHtml(feature: FootballFeature): string {
  return `<div class="football-feature"><i class="${feature.icon}"></i><h3>${escapeHtml(feature.title)}</h3><p>${escapeHtml(feature.description)}</p></div>`;
}

function buildFootballSectionHtml(football: FootballSectionContent): string {
  const features = football.features.map(buildFootballFeatureHtml).join('\n          ');
  return `<section id="futbol" class="football-section">
      <div class="football-content">
        <div class="football-icon"><i class="fas fa-futbol"></i></div>
        <h2>${escapeHtml(football.headline)}</h2>
        <p>${escapeHtml(football.introPrefix)} <span class="highlight">${escapeHtml(football.highlightName)}</span></p>
        <p style="font-size: 1.3rem; margin: 2rem 0;"><strong>${escapeHtml(football.tagline)}</strong></p>
        <div class="football-features">
          ${features}
        </div>
        <div style="margin-top: 3rem;"><a href="#reservas" class="btn btn-primary" style="font-size: 1.1rem; padding: 1.2rem 3rem;"><i class="fas fa-calendar-check"></i> ${escapeHtml(football.ctaText)}</a></div>
      </div>
    </section>`;
}

function buildDailyMenuSectionHtml(cards: DailyMenuCard[]): string {
  const grid = cards.map(buildDailyMenuCardHtml).join('\n          ');
  return `<section id="menu-diario">
      <div class="daily-menu-section">
        <div class="section-header"><h2 class="section-title">Nuestros Menús</h2><p class="section-subtitle">La mejor relación calidad-precio</p></div>
        <div class="menu-grid-daily">
          ${grid}
        </div>
      </div>
    </section>`;
}

function buildGalleryGridHtml(images: GalleryImage[]): string {
  return images
    .map(
      (img, index) =>
        `<div class="gallery-item" onclick="openLightbox(${index})"><img src="${escapeHtml(galleryGridUrl(img.url))}" alt="${escapeHtml(img.alt)}" loading="lazy"></div>`
    )
    .join('\n        ');
}

function buildGalleryImagesScript(images: GalleryImage[]): string {
  const urls = images.map((img) => `'${galleryLightboxUrl(img.url).replace(/'/g, "\\'")}'`);
  return `const galleryImages = [\n      ${urls.join(',\n      ')}\n    ];`;
}

/** Sustituye carta, destacados, menús del día y galería en el HTML de Mesón. */
export function applyMesonContent(html: string, content: PremiumStarterContent): string {
  let out = html;

  if (content.digital.googleRating.trim() || content.digital.qrHeadline.trim()) {
    out = out.replace(/<div class="hero-trust-badges" id="hero-trust">[\s\S]*?<\/div>/, buildHeroTrustHtml(content.digital));
    if (out.includes('id="carta-digital"')) {
      out = out.replace(/<section id="carta-digital">[\s\S]*?<\/section>/, buildCartaDigitalSectionHtml(content.digital));
    }
    if (content.digital.reviews.length > 0 && out.includes('id="reseñas"')) {
      out = out.replace(/<section id="reseñas">[\s\S]*?<\/section>/, buildResenasSectionHtml(content.digital));
    }
    const reservaPatch = buildReservaDigitalPatch(content.digital);
    out = out.replace(/<div class="reserva-24-banner">[\s\S]*?<\/div>\s*<h3>/, `${reservaPatch.banner}\n            <h3>`);
    out = out.replace(/<ul class="booking-features">[\s\S]*?<\/ul>/, reservaPatch.features);
  }

  if (content.football.features.length > 0 || content.football.headline.trim()) {
    out = out.replace(/<section id="futbol"[^>]*>[\s\S]*?<\/section>/, buildFootballSectionHtml(content.football));
  }

  if (
    content.info.locationLines.length > 0 ||
    content.info.hoursLines.length > 0 ||
    content.info.priceLines.length > 0 ||
    content.info.specialtyItems.length > 0
  ) {
    out = out.replace(/<section id="info">[\s\S]*?<\/section>/, buildInfoSectionHtml(content.info));
  }

  if (content.highlights.length > 0) {
    out = out.replace(/<section id="destacados">[\s\S]*?<\/section>/, buildHighlightsSectionHtml(content.highlights));
  }

  if (content.dailyMenus.length > 0) {
    out = out.replace(/<section id="menu-diario">[\s\S]*?<\/section>/, buildDailyMenuSectionHtml(content.dailyMenus));
  }

  if (content.menu.length > 0) {
    out = out.replace(/<section id="menu">[\s\S]*?<\/section>/, buildMenuSectionHtml(content.menu));
  }

  if (content.gallery.length > 0) {
    out = out.replace(
      /<div class="gallery-grid">[\s\S]*?<\/div>/,
      `<div class="gallery-grid">\n        ${buildGalleryGridHtml(content.gallery)}\n      </div>`
    );
    out = out.replace(/const galleryImages = \[[\s\S]*?\];/, buildGalleryImagesScript(content.gallery));
  }

  return out;
}

/** Personalización + contenido editable sobre HTML base. */
export function rebuildMesonHtml(
  baseHtml: string,
  personalize: (html: string) => string,
  content: PremiumStarterContent
): string {
  return applyMesonContent(personalize(baseHtml), content);
}

function parsePriceToNumber(price?: string): number {
  if (!price?.trim()) return 0;
  return parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function buildMenuJsonForPedir(menu: MenuCategory[]): string {
  let id = 1;
  const rows: object[] = [];
  for (const cat of menu) {
    for (const item of cat.items) {
      if (!item.name.trim()) continue;
      rows.push({
        id: id++,
        category: cat.id,
        categoryLabel: cat.name,
        name: item.name.trim(),
        desc: item.description?.trim() ?? '',
        price: parsePriceToNumber(item.price),
        priceLabel: item.price?.trim() ?? '',
      });
    }
  }
  return JSON.stringify(rows);
}

/** Página de pedidos por mesa + WhatsApp (como Rest Art Café). */
export function buildPedirPageHtml(
  content: PremiumStarterContent,
  businessName: string,
  phoneE164: string
): string {
  const menuJson = buildMenuJsonForPedir(content.menu);
  const sendLabel = escapeHtml(content.digital.orderSendButtonText || 'Enviar pedido por WhatsApp');
  const biz = escapeHtml(businessName);
  const phone = phoneE164.replace(/\D/g, '');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"/>
  <title>Pedir | ${biz}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <style>
    :root { --color-bg:#faf9f6; --color-text:#1a1a1a; --color-text-light:#6b7280; --color-accent:#b8954a; --color-accent-dark:#8b6f3a; --color-white:#fff; --color-border:#e8e5de; --radius:16px; }
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Inter',sans-serif; background:var(--color-bg); color:var(--color-text); min-height:100vh; padding-bottom:120px; }
    .pedir-header { background:linear-gradient(135deg,#1a1a1a,#2d2d2d); color:white; padding:1.25rem 1.5rem; position:sticky; top:0; z-index:30; box-shadow:0 4px 20px rgba(0,0,0,.15); }
    .pedir-header-inner { max-width:640px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; gap:1rem; }
    .pedir-header a { color:var(--color-accent); text-decoration:none; font-weight:600; }
    .pedir-header h1 { font-family:'Playfair Display',serif; font-size:1.35rem; }
    #mesa-badge { display:none; font-size:.75rem; background:rgba(184,149,74,.2); color:#d4b978; padding:.25rem .65rem; border-radius:999px; font-weight:700; }
    .cats { max-width:640px; margin:0 auto; padding:1rem 1.5rem; display:flex; gap:.5rem; overflow-x:auto; position:sticky; top:68px; z-index:20; background:var(--color-bg); border-bottom:1px solid var(--color-border); }
    .cat-btn { border:none; padding:.55rem 1rem; border-radius:999px; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; cursor:pointer; white-space:nowrap; background:var(--color-white); color:var(--color-text-light); border:1px solid var(--color-border); }
    .cat-btn.active { background:var(--color-accent); color:white; border-color:var(--color-accent); }
    #items { max-width:640px; margin:0 auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
    .item-card { background:white; border:1px solid var(--color-border); border-radius:var(--radius); padding:1.25rem; display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; box-shadow:0 2px 12px rgba(0,0,0,.04); }
    .item-card h3 { font-family:'Playfair Display',serif; font-size:1.1rem; margin-bottom:.35rem; }
    .item-card p { color:var(--color-text-light); font-size:.9rem; line-height:1.5; }
    .item-price { color:var(--color-accent); font-weight:700; font-family:'Playfair Display',serif; margin-top:.5rem; display:block; }
    .add-btn { width:42px; height:42px; border-radius:50%; border:none; background:var(--color-accent); color:white; font-size:1.4rem; font-weight:700; cursor:pointer; flex-shrink:0; }
    .add-btn:hover { background:var(--color-accent-dark); }
    #cart-bar { display:none; position:fixed; bottom:0; left:0; right:0; background:white; border-top:1px solid var(--color-border); box-shadow:0 -8px 30px rgba(0,0,0,.1); z-index:40; padding:1rem 1.5rem; }
    #cart-bar.visible { display:block; }
    .cart-inner { max-width:640px; margin:0 auto; }
    #cart-list { max-height:140px; overflow-y:auto; margin:1rem 0; }
    .cart-row { display:flex; justify-content:space-between; padding:.5rem 0; border-bottom:1px solid var(--color-border); font-size:.9rem; }
    .cart-row button { background:none; border:none; color:#dc2626; cursor:pointer; }
    #send-order { width:100%; padding:1rem; border:none; border-radius:999px; background:#25D366; color:white; font-weight:700; font-size:1.05rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.5rem; }
    #send-order:hover { background:#128C7E; }
  </style>
</head>
<body>
  <header class="pedir-header">
    <div class="pedir-header-inner">
      <a href="index.html"><i class="fas fa-arrow-left"></i> Volver</a>
      <div style="text-align:right"><h1>La Carta</h1><span id="mesa-badge"></span></div>
    </div>
  </header>
  <div id="cats" class="cats"></div>
  <div id="items"></div>
  <div id="cart-bar">
    <div class="cart-inner">
      <strong>Tu pedido (<span id="cart-count">0</span>)</strong>
      <div id="cart-list"></div>
      <button type="button" id="send-order"><i class="fab fa-whatsapp"></i> ${sendLabel}</button>
    </div>
  </div>
  <script>
    const BUSINESS_NAME = ${JSON.stringify(businessName)};
    const WHATSAPP = ${JSON.stringify(phone)};
    const MENU = ${menuJson};
    const params = new URLSearchParams(location.search);
    const mesa = params.get('mesa');
    let active = 'all';
    let cart = [];
    if (mesa) {
      const b = document.getElementById('mesa-badge');
      b.textContent = 'MESA ' + mesa;
      b.style.display = 'inline-block';
    }
    const categories = [{ id: 'all', label: 'Todo' }].concat(
      [...new Map(MENU.map(i => [i.category, i.categoryLabel])).entries()].map(([id, label]) => ({ id, label }))
    );
    const catsEl = document.getElementById('cats');
    categories.forEach(c => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = c.label;
      btn.className = 'cat-btn' + (c.id === active ? ' active' : '');
      btn.dataset.cat = c.id;
      btn.onclick = () => { active = c.id; render(); };
      catsEl.appendChild(btn);
    });
    function render() {
      catsEl.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === active);
      });
      const list = active === 'all' ? MENU : MENU.filter(i => i.category === active);
      document.getElementById('items').innerHTML = list.map(i =>
        '<div class="item-card"><div><h3>' + i.name + '</h3>' +
        (i.desc ? '<p>' + i.desc + '</p>' : '') +
        '<span class="item-price">' + (i.priceLabel || (i.price ? i.price.toFixed(2) + ' €' : '')) + '</span></div>' +
        '<button type="button" class="add-btn" data-id="' + i.id + '">+</button></div>'
      ).join('');
      document.querySelectorAll('.add-btn').forEach(b => b.onclick = () => {
        const item = MENU.find(x => x.id === +b.dataset.id);
        if (item) { cart.push(item); updateCart(); }
      });
    }
    function updateCart() {
      const bar = document.getElementById('cart-bar');
      if (!cart.length) { bar.classList.remove('visible'); return; }
      bar.classList.add('visible');
      document.getElementById('cart-count').textContent = cart.length;
      document.getElementById('cart-list').innerHTML = cart.map((item, i) =>
        '<div class="cart-row"><span>' + item.name + '</span><button type="button" data-i="' + i + '">✕</button></div>'
      ).join('');
      document.querySelectorAll('#cart-list button').forEach(b => b.onclick = () => {
        cart.splice(+b.dataset.i, 1);
        updateCart();
      });
    }
    document.getElementById('send-order').onclick = () => {
      if (!cart.length) return;
      let msg = 'Hola ' + BUSINESS_NAME + ' 👋\\n';
      if (mesa) msg += '📍 Mesa ' + mesa + '\\n\\n';
      msg += '*Mi pedido:*\\n';
      cart.forEach((item, i) => {
        msg += (i + 1) + '. ' + item.name;
        if (item.priceLabel) msg += ' (' + item.priceLabel + ')';
        else if (item.price) msg += ' (' + item.price.toFixed(2) + '€)';
        msg += '\\n';
      });
      const total = cart.reduce((s, i) => s + (i.price || 0), 0);
      if (total > 0) msg += '\\n💰 *Total: ' + total.toFixed(2) + '€*';
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
    };
    render();
  </script>
</body>
</html>`;
}
