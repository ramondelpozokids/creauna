import { NextResponse } from 'next/server';
import { listPublicSectors, PRIORITY_SECTORS, SECTOR_CATALOG, SECTOR_GROUPS } from '../../../data/sectorLibrary';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') === 'en' ? 'en' : 'es';
  const tier = searchParams.get('tier') as 'priority' | 'extended' | 'all' | null;

  const sectors = listPublicSectors(lang, tier ?? 'all');

  return NextResponse.json({
    sectors,
    groups: SECTOR_GROUPS.map((g) => ({
      id: g.id,
      label: lang === 'es' ? g.labelEs : g.labelEn,
    })),
    stats: {
      total: SECTOR_CATALOG.length,
      priority: PRIORITY_SECTORS.length,
    },
  });
}
