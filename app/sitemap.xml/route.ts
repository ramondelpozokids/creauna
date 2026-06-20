import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://creauna.vercel.app').replace(/\/$/, '');

  const urls = [
    '',
    '/studio',
    '/templates',
    '/dashboard',
    '/login',
    '/signup',
    '/legal',
    '/privacidad',
    '/cookies',
    '/datos',
    '/mapa',
    '/guia',
    '/como-funciona',
    '/modernizacion',
    '/web-a-medida',
    '/contacto',
    '/equipo-ias',
    '/about',
    '/blog',
    '/precios',
  ];

  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
