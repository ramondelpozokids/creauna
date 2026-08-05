const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

const SKIP = new Set([
  'd_ensalada_tropical',
  'd_hamburguesa_de_ternera',
  'd_fruta_de_temporada'
]);

function extract(sectionId) {
  const re = new RegExp(`<section[^>]*id="${sectionId}"[\\s\\S]*?</section>`, 'i');
  const m = html.match(re);
  if (!m) return [];
  const block = m[0];
  const cats = [];
  const parts = block.split(/<div class="(?:menu|wine|cocktail)-category">/);
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const title = p.match(/data-i18n="(c_[^"]+)">([^<]*)</);
    if (!title) continue;
    const items = [];
    const chunks = p.split(/<div class="(?:menu|wine|cocktail)-item">/);
    for (let j = 1; j < chunks.length; j++) {
      const c = chunks[j];
      const name = c.match(/data-i18n="(d_[^"]+)">([^<]*)</);
      const price = c.match(/class="price">([^<]+)</);
      if (!name || !price) continue;
      if (SKIP.has(name[1])) continue;
      items.push({ id: name[1], name: name[2].trim(), price: price[1].trim() });
    }
    if (items.length) cats.push({ key: title[1], title: title[2].trim(), items });
  }
  return cats;
}

const all = [...extract('sugerencias'), ...extract('menu'), ...extract('vinos'), ...extract('cocteles')];
const out = path.resolve(__dirname, '../data/carta-completa.js');
const js =
  '/** Full waiter-style carta — extracted from the live page (orphans removed). */\n' +
  'export const CARTA_CATEGORIES = ' +
  JSON.stringify(all, null, 2) +
  ';\n';
fs.writeFileSync(out, js, 'utf8');
console.log(all.map((c) => `${c.key}: ${c.items.length}`).join('\n'));
console.log('TOTAL', all.reduce((s, c) => s + c.items.length, 0));
