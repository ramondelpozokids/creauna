/**
 * Cambios quirúrgicos sobre fullpage HTML (añadir sección entre/después de anclas)
 * sin depender de un rewrite completo de la IA.
 */
import { IMAGE_BANK } from './imageBank';

export type InsertSectionRequest = {
  title: string;
  afterLabel: string;
  /** Vacío si el pedido es solo «después de X». */
  beforeLabel: string;
  kind: 'seasonal_products' | 'generic_products' | 'pricing_plans' | 'digital_platform' | 'generic';
};

export type SurgicalInsertResult = {
  ok: boolean;
  html: string;
  sectionId: string;
  reason?: string;
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function slugifySectionId(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'nueva-seccion';
}

function normalizeLabel(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/["«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Quita «la sección de» / «the section of» del ancla. */
export function cleanAnchorLabel(label: string): string {
  return label
    .replace(/^(la\s+)?secci[oó]n\s+(de\s+)?/i, '')
    .replace(/^(the\s+)?section\s+(of\s+|for\s+)?/i, '')
    .trim();
}

function detectKind(title: string, prompt: string): InsertSectionRequest['kind'] {
  const blob = `${title} ${prompt}`;
  if (
    /plataforma\s+digital|subida\s+de\s+facturas|firma\s+digital|panel\s+de\s+control|notificaciones|n[oó]minas|inteligencia\s+artificial/i.test(
      blob
    )
  ) {
    return 'digital_platform';
  }
  // Precios/planes: por título o señales fuertes (no basta «precio» suelto en productos)
  if (
    /precio|planes?|tarif|pricing|tiers?/i.test(title) ||
    /tabla\s+comparativ|comparativ\w*\s+de\s+servicios|(?:aut[oó]nomos|freelancers?).{0,40}(?:pyme|sme)|(?:pyme|sme).{0,40}empres/i.test(
      blob
    )
  ) {
    return 'pricing_plans';
  }
  if (/temporada|seasonal|estaci[oó]n/i.test(blob)) return 'seasonal_products';
  if (/producto|product|carta|cat[aá]logo|menu|menú/i.test(blob)) return 'generic_products';
  return 'generic';
}

/** Detecta "añade sección X entre A y B" o "después de A". */
export function parseInsertSectionRequest(prompt: string): InsertSectionRequest | null {
  const cleaned = prompt.replace(/\s+/g, ' ').trim();

  const betweenPatterns = [
    /(?:a[nñ]ade|agrega|inserta|pon(?:me)?)\s+(?:una\s+)?(?:nueva\s+)?secci[oó]n\s+(?:llamada\s+|titulada\s+|de\s+nombre\s+)?["«“]([^"»”\n]{3,80})["»”]\s+entre\s+["«“]([^"»”\n]{2,60})["»”]\s+y\s+["«“]([^"»”\n]{2,60})["»”]/i,
    /(?:a[nñ]ade|agrega|inserta|pon(?:me)?)\s+(?:una\s+)?(?:nueva\s+)?secci[oó]n\s+(?:llamada\s+|titulada\s+|de\s+nombre\s+)?([^,.\n]{3,80}?)\s+entre\s+([^,.\n]{2,40}?)\s+y\s+([^,.\n]{2,40}?)(?:\.|,|\s+Incluye|\s+con\s+|$)/i,
    /(?:add|insert)\s+(?:a\s+)?(?:new\s+)?section\s+(?:called\s+|named\s+)?["«“]([^"»”\n]{3,80})["»”]\s+between\s+["«“]([^"»”\n]{2,60})["»”]\s+and\s+["«“]([^"»”\n]{2,60})["»”]/i,
  ];

  for (const re of betweenPatterns) {
    const m = cleaned.match(re);
    if (!m) continue;
    const title = m[1].trim().replace(/[.,;:]+$/, '');
    const afterLabel = cleanAnchorLabel(m[2].trim().replace(/[.,;:]+$/, ''));
    const beforeLabel = cleanAnchorLabel(m[3].trim().replace(/[.,;:]+$/, ''));
    if (title.length < 3 || afterLabel.length < 2 || beforeLabel.length < 2) continue;
    return { title, afterLabel, beforeLabel, kind: detectKind(title, prompt) };
  }

  const afterPatterns = [
    /(?:a[nñ]ade|agrega|inserta|pon(?:me)?)\s+(?:una\s+)?(?:nueva\s+)?secci[oó]n\s+(?:llamada\s+|titulada\s+|de\s+nombre\s+)?["«“]([^"»”\n]{3,80})["»”]\s+despu[eé]s\s+de\s+(?:la\s+secci[oó]n\s+(?:de\s+)?)?([^,.\n]{2,60}?)(?:\.|,|\s+Incluye|\s+con\s+|$)/i,
    /(?:a[nñ]ade|agrega|inserta|pon(?:me)?)\s+(?:una\s+)?(?:nueva\s+)?secci[oó]n\s+(?:llamada\s+|titulada\s+|de\s+nombre\s+)?([^,.\n]{3,80}?)\s+despu[eé]s\s+de\s+(?:la\s+secci[oó]n\s+(?:de\s+)?)?([^,.\n]{2,40}?)(?:\.|,|\s+Incluye|\s+con\s+|$)/i,
    /(?:add|insert)\s+(?:a\s+)?(?:new\s+)?section\s+(?:called\s+|named\s+)?["«“]([^"»”\n]{3,80})["»”]\s+after\s+(?:the\s+)?(?:section\s+(?:of\s+|for\s+)?)?([^,.\n]{2,60}?)(?:\.|,|\s+Include|\s+with\s+|$)/i,
    /(?:add|insert)\s+(?:a\s+)?(?:new\s+)?section\s+(?:called\s+|named\s+)?([^,.\n]{3,80}?)\s+after\s+(?:the\s+)?(?:section\s+(?:of\s+|for\s+)?)?([^,.\n]{2,40}?)(?:\.|,|\s+Include|\s+with\s+|$)/i,
  ];

  for (const re of afterPatterns) {
    const m = cleaned.match(re);
    if (!m) continue;
    const title = m[1].trim().replace(/[.,;:]+$/, '');
    const afterLabel = cleanAnchorLabel(m[2].trim().replace(/[.,;:]+$/, ''));
    if (title.length < 3 || afterLabel.length < 2) continue;
    return { title, afterLabel, beforeLabel: '', kind: detectKind(title, prompt) };
  }

  // Solo «añade sección llamada X» (sin ancla) → insertar antes de contacto
  const barePatterns = [
    /(?:a[nñ]ade|agrega|inserta|pon(?:me)?)\s+(?:una\s+)?(?:nueva\s+)?secci[oó]n\s+(?:llamada\s+|titulada\s+|de\s+nombre\s+)?["«“]([^"»”\n]{3,80})["»”]/i,
    /(?:add|insert)\s+(?:a\s+)?(?:new\s+)?section\s+(?:called\s+|named\s+)?["«“]([^"»”\n]{3,80})["»”]/i,
  ];
  for (const re of barePatterns) {
    const m = cleaned.match(re);
    if (!m) continue;
    const title = m[1].trim().replace(/[.,;:]+$/, '');
    if (title.length < 3) continue;
    return {
      title,
      afterLabel: '',
      beforeLabel: 'contacto',
      kind: detectKind(title, prompt),
    };
  }

  return null;
}

/** Marcadores que el HTML debe contener tras aplicar el pedido (rewrite o surgical). */
export function changeRequestMarkers(prompt: string): string[] {
  const insert = parseInsertSectionRequest(prompt);
  if (insert) {
    if (insert.kind === 'pricing_plans') {
      return [insert.title, 'Autónomos', 'PYMES'];
    }
    if (insert.kind === 'digital_platform') {
      return [insert.title];
    }
    return [insert.title];
  }
  const quoted = [...prompt.matchAll(/["«]([^"»]{4,60})["»]/g)].map((m) => m[1].trim());
  return quoted.slice(0, 3);
}

export function htmlHasChangeMarkers(html: string, markers: string[]): boolean {
  if (!markers.length) return true;
  const lower = html.toLowerCase();
  return markers.every((m) => lower.includes(m.toLowerCase()));
}

function isBareProductsLabel(n: string): boolean {
  return /^(productos?(?:\s+destacados)?|products?(?:\s+featured)?|featured\s+products)$/i.test(n);
}

function isBareGalleryLabel(n: string): boolean {
  return /^(galer[ií]a|gallery)$/i.test(n);
}

function labelMatchers(label: string): { exactId: RegExp; scored: { re: RegExp; score: number }[] } {
  const n = normalizeLabel(cleanAnchorLabel(label));
  const idGuess = slugifySectionId(label);
  const exactId = new RegExp(`id=["']${idGuess}["']`, 'i');
  const scored: { re: RegExp; score: number }[] = [
    { re: exactId, score: 100 },
    { re: new RegExp(`href=["']#${idGuess}["']`, 'i'), score: 40 },
  ];

  if (isBareProductsLabel(n)) {
    scored.push(
      { re: /id=["']productos["']/i, score: 90 },
      { re: /id=["']products["']/i, score: 90 },
      { re: /<h2[^>]*>\s*productos(?:\s+destacados)?/i, score: 70 }
    );
  }
  if (isBareGalleryLabel(n)) {
    scored.push(
      { re: /id=["']galeria["']/i, score: 90 },
      { re: /id=["']gallery["']/i, score: 90 },
      { re: /<h2[^>]*>\s*galer/i, score: 70 }
    );
  }
  if (/^(servicios?|services?)$/i.test(n)) {
    scored.push({ re: /id=["']servicios["']/i, score: 90 }, { re: /id=["']services["']/i, score: 90 });
  }
  if (/^(contacto|contact)$/i.test(n)) {
    scored.push({ re: /id=["']contacto["']/i, score: 90 }, { re: /id=["']contact["']/i, score: 90 });
  }
  if (/^(nosotros|about|historia)$/i.test(n)) {
    scored.push({ re: /id=["']nosotros["']/i, score: 90 }, { re: /id=["']about["']/i, score: 90 });
  }
  if (/^(precio|precios|planes|pricing)$/i.test(n)) {
    scored.push(
      { re: /id=["']precios-y-planes["']/i, score: 90 },
      { re: /id=["']precios["']/i, score: 85 },
      { re: /id=["']pricing["']/i, score: 85 }
    );
  }

  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  scored.push({ re: new RegExp(`<h2[^>]*>\\s*[^<]*${escaped}`, 'i'), score: 80 });
  return { exactId, scored };
}

/** Índice de inicio de la <section> que mejor coincide con la etiqueta. */
export function findSectionStartIndex(html: string, label: string): number {
  if (!label?.trim()) return -1;
  const { exactId, scored } = labelMatchers(label);
  let bestIdx = -1;
  let bestScore = 0;
  const sectionRe = /<section\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = sectionRe.exec(html))) {
    const chunk = html.slice(m.index, Math.min(html.length, m.index + 900));
    if (exactId.test(chunk)) return m.index;
    for (const { re, score } of scored) {
      if (re.test(chunk) && score > bestScore) {
        bestScore = score;
        bestIdx = m.index;
      }
    }
  }
  return bestIdx;
}

function seasonProducts(lang: 'es' | 'en'): { name: string; desc: string; price: string; imgHint: string }[] {
  const month = new Date().getMonth(); // 0=ene
  const es = lang === 'es';
  if (month >= 5 && month <= 7) {
    return es
      ? [
          { name: 'Tarta de frutas del bosque', desc: 'Base crujiente y frutas de temporada.', price: '22 €', imgHint: 'tarta frutas' },
          { name: 'Bizcocho de limón', desc: 'Esponjoso, glaseado cítrico.', price: '14 €', imgHint: 'pastel limon' },
          { name: 'Croissant de albaricoque', desc: 'Mantequilla y confitura casera.', price: '2,80 €', imgHint: 'croissant' },
          { name: 'Helado artesano de vainilla', desc: 'Vasito o cucurucho, elaboración propia.', price: '3,50 €', imgHint: 'pastel' },
          { name: 'Focaccia de tomate y hierbas', desc: 'Horneada del día, ideal para picar.', price: '4,50 €', imgHint: 'pan' },
          { name: 'Magdalena de limón y amapola', desc: 'Receta de verano, lote pequeño.', price: '1,90 €', imgHint: 'bolleria' },
        ]
      : [
          { name: 'Summer berry tart', desc: 'Crisp base with seasonal fruit.', price: '€22', imgHint: 'cake fruit' },
          { name: 'Lemon loaf', desc: 'Soft crumb, citrus glaze.', price: '€14', imgHint: 'lemon cake' },
          { name: 'Apricot croissant', desc: 'Butter pastry with house jam.', price: '€2.80', imgHint: 'croissant' },
          { name: 'Vanilla gelato cup', desc: 'House-made, cone or cup.', price: '€3.50', imgHint: 'pastry' },
          { name: 'Tomato herb focaccia', desc: 'Baked daily, perfect to share.', price: '€4.50', imgHint: 'bread' },
          { name: 'Lemon poppy muffin', desc: 'Small-batch summer bake.', price: '€1.90', imgHint: 'pastry' },
        ];
  }
  if (month >= 8 && month <= 10) {
    return es
      ? [
          { name: 'Tarta de manzana', desc: 'Canela y manzana asada.', price: '18 €', imgHint: 'manzana' },
          { name: 'Pan de centeno con nueces', desc: 'Masa madre, corteza firme.', price: '4,20 €', imgHint: 'centeno' },
          { name: 'Hojaldre de calabaza', desc: 'Relleno suave especiado.', price: '2,60 €', imgHint: 'hojaldre' },
          { name: 'Brownie de chocolate', desc: 'Intenso, con nueces.', price: '3,20 €', imgHint: 'chocolate' },
          { name: 'Palmera de chocolate', desc: 'Hojaldre caramelizado.', price: '2,10 €', imgHint: 'palmera' },
          { name: 'Pan de maíz', desc: 'Miga tierna, ideal con queso.', price: '3,80 €', imgHint: 'pan' },
        ]
      : [
          { name: 'Apple tart', desc: 'Baked apple and cinnamon.', price: '€18', imgHint: 'apple' },
          { name: 'Rye walnut loaf', desc: 'Sourdough, firm crust.', price: '€4.20', imgHint: 'rye' },
          { name: 'Pumpkin pastry', desc: 'Soft spiced filling.', price: '€2.60', imgHint: 'pastry' },
          { name: 'Chocolate brownie', desc: 'Dense, with walnuts.', price: '€3.20', imgHint: 'chocolate' },
          { name: 'Chocolate palmier', desc: 'Caramelised puff pastry.', price: '€2.10', imgHint: 'pastry' },
          { name: 'Corn bread', desc: 'Soft crumb, great with cheese.', price: '€3.80', imgHint: 'bread' },
        ];
  }
  if (month === 11 || month <= 1) {
    return es
      ? [
          { name: 'Roscón / corona de invierno', desc: 'Fruta confitada y crema.', price: '24 €', imgHint: 'pastel' },
          { name: 'Pan de especias', desc: 'Canela, anís y miel.', price: '4,50 €', imgHint: 'pan' },
          { name: 'Trufas de chocolate', desc: 'Cacao intenso, caja de 6.', price: '9 €', imgHint: 'chocolate' },
          { name: 'Hojaldre de crema', desc: 'Clásico de pastelería.', price: '2,40 €', imgHint: 'hojaldre' },
          { name: 'Galletas de jengibre', desc: 'Crujientes, aroma navideño.', price: '6 €/caja', imgHint: 'bolleria' },
          { name: 'Tarta de queso al horno', desc: 'Suave, con coulis de frutos rojos.', price: '20 €', imgHint: 'queso' },
        ]
      : [
          { name: 'Winter crown cake', desc: 'Candied fruit and cream.', price: '€24', imgHint: 'cake' },
          { name: 'Spiced loaf', desc: 'Cinnamon, anise and honey.', price: '€4.50', imgHint: 'bread' },
          { name: 'Chocolate truffles', desc: 'Box of 6, deep cocoa.', price: '€9', imgHint: 'chocolate' },
          { name: 'Cream puff pastry', desc: 'Classic bakery treat.', price: '€2.40', imgHint: 'pastry' },
          { name: 'Ginger cookies', desc: 'Crisp festive batch.', price: '€6/box', imgHint: 'pastry' },
          { name: 'Baked cheesecake', desc: 'With red berry coulis.', price: '€20', imgHint: 'cheesecake' },
        ];
  }
  return es
    ? [
        { name: 'Tarta de fresa', desc: 'Nata ligera y fresas frescas.', price: '21 €', imgHint: 'frutas' },
        { name: 'Brioche de limón', desc: 'Miga aireada, aroma cítrico.', price: '3,40 €', imgHint: 'brioche' },
        { name: 'Pan de espelta', desc: 'Harina de calidad, corteza fina.', price: '3,90 €', imgHint: 'pan' },
        { name: 'Napolitana de crema', desc: 'Hojaldre y crema pastelera.', price: '2,50 €', imgHint: 'napolitan' },
        { name: 'Magdalena de vainilla', desc: 'Receta de temporada.', price: '1,80 €', imgHint: 'magdalena' },
        { name: 'Quiche de verduras', desc: 'Masa casera, relleno del día.', price: '4,80 €', imgHint: 'pastel' },
      ]
    : [
        { name: 'Strawberry tart', desc: 'Light cream and fresh berries.', price: '€21', imgHint: 'fruit' },
        { name: 'Lemon brioche', desc: 'Airy crumb, citrus scent.', price: '€3.40', imgHint: 'brioche' },
        { name: 'Spelt loaf', desc: 'Quality flour, thin crust.', price: '€3.90', imgHint: 'bread' },
        { name: 'Cream pastry', desc: 'Puff pastry and custard.', price: '€2.50', imgHint: 'pastry' },
        { name: 'Vanilla muffin', desc: 'Seasonal batch.', price: '€1.80', imgHint: 'pastry' },
        { name: 'Veggie quiche', desc: 'House dough, daily filling.', price: '€4.80', imgHint: 'savory' },
      ];
}

function pickImage(hint: string, i: number, pool: string[], used: Set<string>): string {
  const t = hint.toLowerCase();
  let preferred: readonly string[] = IMAGE_BANK.bakery.gallery;
  if (/pan|bread|centeno|espelta|focaccia|masa/i.test(t)) preferred = IMAGE_BANK.bakery.bread;
  else if (/croissant|brioche|boll|hojaldre|napolitan|magdalena|palmera|pastry/i.test(t))
    preferred = IMAGE_BANK.bakery.pastry;
  else if (/tarta|pastel|cake|chocolate|queso|frut|manzana|limon|limón/i.test(t))
    preferred = IMAGE_BANK.bakery.cakes;

  const tryPools: Array<readonly string[]> = [preferred, pool, IMAGE_BANK.bakery.gallery, IMAGE_BANK.bakery.bread];
  for (const p of tryPools) {
    for (let k = 0; k < p.length; k++) {
      const url = p[(i + k) % p.length];
      if (url && !used.has(url)) {
        used.add(url);
        return url;
      }
    }
  }
  return pool[i % Math.max(pool.length, 1)] || IMAGE_BANK.bakery.gallery[0];
}

function extractExistingImages(html: string): string[] {
  const urls: string[] = [];
  for (const m of html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi)) {
    if (m[1] && !/svg|placeholder|creauna/i.test(m[1])) urls.push(m[1]);
  }
  return [...new Set(urls)];
}

function buildPricingPlansHtml(req: InsertSectionRequest, sectionId: string, lang: 'es' | 'en'): string {
  const es = lang === 'es';
  // Nombres de plan fijos (marcadores ES); subtítulos traducidos
  const plans = es
    ? [
        {
          name: 'Autónomos',
          price: 'desde 49 €/mes',
          blurb: 'Fiscalidad y contabilidad esenciales para trabajadores por cuenta propia.',
          highlight: false,
        },
        {
          name: 'PYMES',
          price: 'desde 129 €/mes',
          blurb: 'Gestión integral para pymes: laboral, impuestos y asesoría continua.',
          highlight: true,
        },
        {
          name: 'Empresas',
          price: 'desde 249 €/mes',
          blurb: 'Soporte prioritario, reporting y acompañamiento estratégico a medida.',
          highlight: false,
        },
      ]
    : [
        {
          name: 'Autónomos',
          price: 'from €49/mo',
          blurb: 'Core tax and bookkeeping for freelancers and sole traders.',
          highlight: false,
        },
        {
          name: 'PYMES',
          price: 'from €129/mo',
          blurb: 'Full SME support: payroll, taxes and ongoing advice.',
          highlight: true,
        },
        {
          name: 'Empresas',
          price: 'from €249/mo',
          blurb: 'Priority support, reporting and tailored strategic guidance.',
          highlight: false,
        },
      ];

  const rows = es
    ? [
        { label: 'Contabilidad', a: true, b: true, c: true },
        { label: 'Impuestos / fiscales', a: true, b: true, c: true },
        { label: 'Laboral / nóminas', a: false, b: true, c: true },
        { label: 'Asesoría incluida', a: '2 h/mes', b: '6 h/mes', c: 'Ilimitada*' },
        { label: 'Soporte prioritario', a: false, b: false, c: true },
      ]
    : [
        { label: 'Bookkeeping', a: true, b: true, c: true },
        { label: 'Tax filings', a: true, b: true, c: true },
        { label: 'Payroll', a: false, b: true, c: true },
        { label: 'Advisory hours', a: '2 h/mo', b: '6 h/mo', c: 'Unlimited*' },
        { label: 'Priority support', a: false, b: false, c: true },
      ];

  const cell = (v: boolean | string) => {
    if (typeof v === 'string') return esc(v);
    return v ? '✓' : '—';
  };

  const cards = plans
    .map(
      (p) => `<article class="rounded-2xl border ${
        p.highlight ? 'border-[#C68E6B] shadow-md ring-1 ring-[#C68E6B]/20' : 'border-black/10 shadow-sm'
      } bg-white p-6 flex flex-col">
  <h3 class="font-display text-xl mb-1">${esc(p.name)}</h3>
  <p class="text-2xl font-semibold text-[#C68E6B] mb-3">${esc(p.price)}</p>
  <p class="text-sm text-neutral-600 flex-1 mb-5">${esc(p.blurb)}</p>
  <a href="#contacto" class="inline-flex justify-center font-btn px-4 py-2.5 rounded-full text-sm ${
    p.highlight ? 'bg-[#C68E6B] text-white hover:opacity-90' : 'border border-black/15 hover:bg-neutral-50'
  } transition">${es ? 'Solicitar presupuesto' : 'Request a quote'}</a>
</article>`
    )
    .join('\n');

  const tableRows = rows
    .map(
      (r) => `<tr class="border-t border-black/5">
  <th scope="row" class="py-3 pr-4 text-left font-medium text-neutral-800">${esc(r.label)}</th>
  <td class="py-3 px-2 text-center text-neutral-700">${cell(r.a)}</td>
  <td class="py-3 px-2 text-center text-neutral-700">${cell(r.b)}</td>
  <td class="py-3 px-2 text-center text-neutral-700">${cell(r.c)}</td>
</tr>`
    )
    .join('\n');

  const intro = es
    ? 'Planes orientativos para Autónomos, PYMES y Empresas. Precios de referencia; el presupuesto final se adapta a tu caso.'
    : 'Indicative plans for Autónomos, PYMES and Empresas. Reference pricing; final quote tailored to your case.';

  const note = es
    ? '* Condiciones según volumen y complejidad. Sin compromiso de permanencia en la propuesta inicial.'
    : '* Terms depend on volume and complexity. No lock-in on the initial proposal.';

  return `<section id="${sectionId}" data-cua-surgical="1" data-cua-pricing="1" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-4 reveal">${esc(req.title)}</h2>
  <p class="text-center text-sm text-neutral-600 mb-12 max-w-2xl mx-auto reveal">${esc(intro)}</p>
  <div class="grid md:grid-cols-3 gap-6 mb-14">
${cards}
  </div>
  <div class="overflow-x-auto reveal">
    <table class="w-full min-w-[520px] text-sm border-collapse">
      <caption class="sr-only">${esc(es ? 'Comparativa de servicios por plan' : 'Service comparison by plan')}</caption>
      <thead>
        <tr class="text-left text-neutral-500">
          <th scope="col" class="pb-3 pr-4 font-medium">${es ? 'Servicio' : 'Service'}</th>
          <th scope="col" class="pb-3 px-2 text-center font-medium">Autónomos</th>
          <th scope="col" class="pb-3 px-2 text-center font-medium">PYMES</th>
          <th scope="col" class="pb-3 px-2 text-center font-medium">Empresas</th>
        </tr>
      </thead>
      <tbody>
${tableRows}
      </tbody>
    </table>
    <p class="mt-4 text-xs text-neutral-500">${esc(note)}</p>
  </div>
</section>
`;
}

function buildDigitalPlatformHtml(
  req: InsertSectionRequest,
  sectionId: string,
  lang: 'es' | 'en'
): string {
  const es = lang === 'es';
  const features = es
    ? [
        ['Subida de facturas', 'Carga documentos y facturas desde cualquier lugar, con historial seguro.'],
        ['Consulta de impuestos', 'Estado de modelos y plazos visibles en tu panel.'],
        ['Acceso a nóminas', 'Descarga y consulta de nóminas cuando las necesites.'],
        ['Firma digital', 'Firma documentos con validez legal sin desplazarte.'],
        ['Notificaciones', 'Avisos de vencimientos, requerimientos y novedades.'],
        ['Panel de control', 'Visión clara de tu negocio y documentación al día.'],
        ['Asistencia con IA', 'Ayuda inteligente para dudas frecuentes y orientación inicial.'],
      ]
    : [
        ['Invoice upload', 'Upload invoices and documents from anywhere, with a secure history.'],
        ['Tax status', 'See filing status and deadlines in your dashboard.'],
        ['Payroll access', 'View and download payroll when you need it.'],
        ['Digital signature', 'Sign documents legally without travelling.'],
        ['Notifications', 'Alerts for deadlines, requests and updates.'],
        ['Control panel', 'A clear view of your business paperwork.'],
        ['AI assistance', 'Smart help for common questions and first guidance.'],
      ];

  const cards = features
    .map(
      ([n, d]) => `<article class="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
  <h3 class="font-display text-lg mb-2">${esc(n)}</h3>
  <p class="text-sm text-neutral-600 leading-relaxed">${esc(d)}</p>
</article>`
    )
    .join('\n');

  const intro = es
    ? 'Gestiona tu negocio online: facturas, impuestos, nóminas, firma digital y asistencia con IA.'
    : 'Run your business online: invoices, taxes, payroll, e-sign and AI assistance.';

  return `<section id="${sectionId}" data-cua-surgical="1" data-cua-platform="1" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-4 reveal">${esc(req.title)}</h2>
  <p class="text-center text-sm text-neutral-600 mb-12 max-w-2xl mx-auto reveal">${esc(intro)}</p>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
${cards}
  </div>
  <div class="text-center mt-10">
    <a href="#contacto" class="font-btn inline-flex px-6 py-3 rounded-full bg-[#111] text-white text-sm hover:opacity-90 transition">${es ? 'Solicitar acceso' : 'Request access'}</a>
  </div>
</section>
`;
}

function buildSectionHtml(
  req: InsertSectionRequest,
  sectionId: string,
  lang: 'es' | 'en',
  imagePool: string[]
): string {
  if (req.kind === 'pricing_plans') {
    return buildPricingPlansHtml(req, sectionId, lang);
  }
  if (req.kind === 'digital_platform') {
    return buildDigitalPlatformHtml(req, sectionId, lang);
  }

  const used = new Set<string>();
  const products =
    req.kind === 'seasonal_products' || req.kind === 'generic_products'
      ? seasonProducts(lang)
      : seasonProducts(lang).slice(0, 3).map((p, i) => ({
          ...p,
          name: lang === 'es' ? `Detalle ${i + 1}` : `Highlight ${i + 1}`,
          desc:
            lang === 'es'
              ? `Contenido de «${req.title}» adaptado a tu negocio.`
              : `Content for “${req.title}” tailored to your business.`,
        }));

  const cards = products
    .map((p, i) => {
      const src = pickImage(p.imgHint + ' ' + p.name, i, imagePool, used);
      return `<article class="group rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-md transition">
  <div class="aspect-[4/3] overflow-hidden bg-neutral-100">
    <img src="${src}" alt="${esc(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" referrerpolicy="no-referrer" />
  </div>
  <div class="p-5">
    <h3 class="font-display text-lg mb-1">${esc(p.name)}</h3>
    <p class="text-sm text-neutral-600 mb-3">${esc(p.desc)}</p>
    <p class="font-semibold text-[#C68E6B]">${esc(p.price)}</p>
  </div>
</article>`;
    })
    .join('\n');

  const intro =
    lang === 'es'
      ? req.kind === 'seasonal_products'
        ? 'Selección según la estación: sabor fresco, horneado del día y precios claros.'
        : `Nueva sección «${req.title}» con propuestas destacadas.`
      : req.kind === 'seasonal_products'
        ? 'Seasonal selection: fresh flavour, daily bake and clear prices.'
        : `New “${req.title}” section with featured picks.`;

  return `<section id="${sectionId}" data-cua-surgical="1" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-4 reveal">${esc(req.title)}</h2>
  <p class="text-center text-sm text-neutral-600 mb-12 max-w-xl mx-auto reveal">${esc(intro)}</p>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
${cards}
  </div>
</section>
`;
}

function injectNavLink(
  html: string,
  sectionId: string,
  title: string,
  beforeLabel: string,
  afterLabel: string
): string {
  const shortLabel = title.length > 22 ? title.slice(0, 20) + '…' : title;
  const link = `<a href="#${sectionId}" class="hover:text-[#C68E6B]">${esc(shortLabel)}</a>`;

  if (beforeLabel.trim()) {
    const beforeIdGuess = slugifySectionId(beforeLabel);
    const hrefPatterns = [
      new RegExp(`(<a\\s+href=["']#${beforeIdGuess}["'][^>]*>)`, 'i'),
      /(<a\s+href=["']#galeria["'][^>]*>)/i,
      /(<a\s+href=["']#gallery["'][^>]*>)/i,
    ];
    for (const re of hrefPatterns) {
      if (re.test(html)) {
        return html.replace(re, `${link}\n      $1`);
      }
    }
  }

  if (afterLabel.trim()) {
    const afterId = slugifySectionId(cleanAnchorLabel(afterLabel));
    const afterAliases =
      /^(servicios?|services?)$/i.test(cleanAnchorLabel(afterLabel))
        ? ['servicios', 'services', afterId]
        : [afterId];
    for (const id of afterAliases) {
      const re = new RegExp(`(<a\\s+href=["']#${id}["'][^>]*>[\\s\\S]*?<\\/a>)`, 'i');
      if (re.test(html)) {
        return html.replace(re, `$1\n      ${link}`);
      }
    }
  }

  return html;
}

/**
 * Inserta una sección nueva entre dos anclas o justo después de una. No toca el resto del HTML.
 */
export function applySurgicalSectionInsert(
  html: string,
  req: InsertSectionRequest,
  lang: 'es' | 'en' = 'es',
  opts?: { imageUrls?: string[] }
): SurgicalInsertResult {
  if (!html || html.length < 500) {
    return { ok: false, html, sectionId: '', reason: 'html_corto' };
  }

  const sectionId = slugifySectionId(req.title);
  if (new RegExp(`id=["']${sectionId}["']`, 'i').test(html)) {
    return { ok: false, html, sectionId, reason: 'ya_existe' };
  }

  const beforeIdx = req.beforeLabel.trim()
    ? findSectionStartIndex(html, req.beforeLabel)
    : -1;
  const afterIdx = req.afterLabel.trim()
    ? findSectionStartIndex(html, req.afterLabel)
    : -1;

  if (beforeIdx < 0 && afterIdx < 0) {
    return { ok: false, html, sectionId, reason: 'anclas_no_encontradas' };
  }

  // Preferir insertar justo antes de "before"; si no, después del cierre de "after"
  let insertAt = beforeIdx;
  if (insertAt < 0 && afterIdx >= 0) {
    const afterOpen = html.slice(afterIdx);
    const closeRel = afterOpen.search(/<\/section>/i);
    insertAt = closeRel >= 0 ? afterIdx + closeRel + '</section>'.length : afterIdx;
  }

  if (insertAt < 0) {
    return { ok: false, html, sectionId, reason: 'no_punto_insercion' };
  }

  if (afterIdx >= 0 && beforeIdx >= 0 && afterIdx > beforeIdx) {
    insertAt = beforeIdx;
  }

  const pool = [
    ...(opts?.imageUrls || []).filter((u) => /^https?:\/\//i.test(u)),
    ...extractExistingImages(html),
    ...IMAGE_BANK.bakery.bread,
    ...IMAGE_BANK.bakery.pastry,
    ...IMAGE_BANK.bakery.cakes,
    ...IMAGE_BANK.bakery.gallery,
  ];

  const sectionHtml = buildSectionHtml(req, sectionId, lang, pool);
  let next = html.slice(0, insertAt) + '\n' + sectionHtml + '\n' + html.slice(insertAt);
  next = injectNavLink(next, sectionId, req.title, req.beforeLabel, req.afterLabel);

  const markers =
    req.kind === 'pricing_plans'
      ? [req.title, 'Autónomos', 'PYMES']
      : [req.title];
  if (!htmlHasChangeMarkers(next, markers)) {
    return { ok: false, html, sectionId, reason: 'marcador_no_insertado' };
  }

  return { ok: true, html: next, sectionId };
}

export type HeroPatchRequest = {
  highlight: string;
};

/** Detecta «actualiza el hero para destacar…» sin tocar el resto. */
export function parseHeroUpdateRequest(prompt: string): HeroPatchRequest | null {
  if (
    !/actualiza(?:\s+tambi[eé]n)?\s+el\s+hero|update\s+(?:the\s+)?hero|destaca(?:r)?\s+(?:este\s+)?nuevo\s+servicio/i.test(
      prompt
    )
  ) {
    return null;
  }
  const m =
    prompt.match(
      /destacar?\s+(?:este\s+)?(?:nuevo\s+)?(?:servicio\s+)?[:\s«"']*([^.»\n"']{8,140})/i
    ) ||
    prompt.match(/plataforma\s+digital[^.\n]{0,80}/i) ||
    prompt.match(/nuevo\s+servicio[^.\n]{0,80}/i);
  const highlight = (m?.[1] || m?.[0] || 'Plataforma Digital').trim().replace(/[.,;:]+$/, '');
  return { highlight: highlight.slice(0, 120) };
}

/**
 * Parchea solo el hero (badge + subtítulo). No toca otras secciones.
 */
export function applyHeroPatch(
  html: string,
  req: HeroPatchRequest,
  lang: 'es' | 'en' = 'es'
): { ok: boolean; html: string; reason?: string } {
  if (!html || html.length < 400) return { ok: false, html, reason: 'html_corto' };

  const badge =
    lang === 'es'
      ? `Nuevo: ${req.highlight}`
      : `New: ${req.highlight}`;
  const subBit =
    lang === 'es'
      ? `Ahora con ${req.highlight} para gestionar tu negocio desde cualquier lugar.`
      : `Now with ${req.highlight} to run your business from anywhere.`;

  let out = html;
  let touched = false;

  // Insertar / actualizar badge en el hero
  const heroOpen =
    /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|data-cua-hero|class=["'][^"']*hero)[^>]*>)([\s\S]*?)(<\/section>)/i;
  if (heroOpen.test(out)) {
    out = out.replace(heroOpen, (_m, open: string, body: string, close: string) => {
      let next = body;
      if (/data-cua-hero-badge/i.test(next)) {
        next = next.replace(
          /(<[^>]*data-cua-hero-badge[^>]*>)([\s\S]*?)(<\/[^>]+>)/i,
          `$1${esc(badge)}$3`
        );
      } else {
        const badgeHtml = `<p data-cua-hero-badge class="inline-flex text-xs uppercase tracking-widest text-white/90 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-4">${esc(badge)}</p>`;
        if (/<h1\b/i.test(next)) {
          next = next.replace(/(<h1\b)/i, `${badgeHtml}\n    $1`);
        } else {
          next = badgeHtml + next;
        }
      }
      // Primera <p> de apoyo tras h1
      next = next.replace(
        /(<h1\b[^>]*>[\s\S]*?<\/h1>\s*)(<p\b[^>]*>)([\s\S]*?)(<\/p>)/i,
        (_mm, pre: string, pOpen: string, _old: string, pClose: string) => {
          touched = true;
          return `${pre}${pOpen}${esc(subBit)}${pClose}`;
        }
      );
      touched = true;
      return open + next + close;
    });
  }

  if (!touched) return { ok: false, html, reason: 'hero_no_encontrado' };
  if (!out.toLowerCase().includes(req.highlight.toLowerCase().slice(0, 12))) {
    // badge siempre incluye highlight
    if (!out.includes(badge)) return { ok: false, html, reason: 'parche_no_aplicado' };
  }
  return { ok: true, html: out };
}

/** Aplica insert quirúrgico y/o parche de hero según el prompt (delta, no rebuild). */
export function applySurgicalDelta(
  html: string,
  prompt: string,
  lang: 'es' | 'en' = 'es',
  opts?: { imageUrls?: string[] }
): { ok: boolean; html: string; didInsert: boolean; didHero: boolean; title?: string } {
  let out = html;
  let didInsert = false;
  let didHero = false;
  let title: string | undefined;

  const insertReq = parseInsertSectionRequest(prompt);
  if (insertReq) {
    const surgical = applySurgicalSectionInsert(out, insertReq, lang, opts);
    if (surgical.ok) {
      out = surgical.html;
      didInsert = true;
      title = insertReq.title;
    }
  }

  const heroReq = parseHeroUpdateRequest(prompt);
  if (heroReq) {
    const patched = applyHeroPatch(out, heroReq, lang);
    if (patched.ok) {
      out = patched.html;
      didHero = true;
    }
  }

  return { ok: didInsert || didHero, html: out, didInsert, didHero, title };
}
