/**
 * Sustituye Unsplash rotos en un HTML local por Pexels verificados (moda).
 * Uso: npx tsx scripts/harden-html-images.ts [ruta.html]
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { IMAGE_BANK } from '../app/lib/ai/imageBank';
import { hardenSiteImages } from '../app/lib/ai/hardenSiteImages';

const target = resolve(process.argv[2] || 'C:/Users/X/Desktop/index.html');
const bank = IMAGE_BANK.fashion;
const urls: string[] = [];
for (const v of Object.values(bank)) {
  if (typeof v === 'string') urls.push(v);
  else urls.push(...v);
}

const html = readFileSync(target, 'utf8');
const before = (html.match(/unsplash/gi) || []).length;
const out = hardenSiteImages(html, urls);
const after = (out.match(/unsplash/gi) || []).length;
writeFileSync(target, out, 'utf8');
console.log(JSON.stringify({ target, unsplashBefore: before, unsplashAfter: after, bytes: out.length }, null, 2));
