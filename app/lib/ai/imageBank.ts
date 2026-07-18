/**
 * Banco de imágenes por sector — Unsplash + Pexels (licencia comercial).
 * IDs curados; el LLM no inventa URLs.
 */
import { pexels, pexelsSq, unsplash, unsplashSq } from './stockImages';

const p = pexels;
const sq = pexelsSq;
const u = unsplash;
const usq = unsplashSq;

export const IMAGE_BANK = {
  cafe: {
    hero: u('1495474472287-4d71bcdd2085', 1600, 900),
    gallery: [sq(941861), sq(1267320), sq(6248864), sq(958545), sq(696218), sq(1023613)],
    menu: [p(941861, 600, 400), p(6248864, 600, 400), p(958545, 600, 400), p(696218, 600, 400)],
    interior: p(1267320, 900, 600),
    terrace: u('1554118811-1e0d58224f24', 900, 600),
    cocktails: [sq(1023613), sq(1267320), sq(6248864)],
  },
  kebab: {
    hero: p(2964195),
    gallery: [p(7049655, 900, 600), p(1639562, 900, 600), p(2964168, 900, 600)],
    menu: [p(1639562, 600, 400), p(2964168, 600, 400), p(5938421, 600, 400), p(7049655, 600, 400)],
  },
  tattoo: {
    hero: p(955938),
    gallery: [p(955938, 900, 600), p(356567, 900, 600), p(6624833, 900, 600)],
    portfolio: [p(955938, 600, 400), p(955938, 600, 400), p(356567, 600, 400), p(6624833, 600, 400)],
  },
  beauty: {
    hero: u('1560066984-138dadb4c035', 1600, 900),
    gallery: [sq(3992858), sq(373834), sq(3993449), sq(3992219), sq(3992876), sq(3992870)],
    services: [p(3993449, 600, 400), p(373834, 600, 400), p(3992876, 600, 400), p(3992219, 600, 400)],
  },
  corporate: {
    hero: u('1497366216548-37526070297c', 1600, 900),
    madrid: p(3379864, 1600, 900),
    gallery: [
      p(3184292, 900, 600),
      p(3184418, 900, 600),
      p(7688336, 900, 600),
      p(3861969, 900, 600),
      u('1522071820081-009f0129c71c', 900, 600),
      p(577585, 900, 600),
    ],
    office: [p(271624, 1200, 800), p(189296, 1200, 800), p(1571460, 1200, 800)],
    team: p(3184418, 800, 600),
    skyline: p(672358, 1400, 800),
  },
  automotive: {
    hero: p(163210),
    gallery: [sq(2116473), sq(2393835), sq(3802510), sq(163210), sq(2116473), sq(2393835)],
    bikes: [p(2116473, 600, 400), p(3802510, 600, 400), p(2393835, 600, 400), p(163210, 600, 400)],
    workshop: p(3802510, 900, 600),
  },
  luxury: {
    hero: u('1414235077428-338989a2e8c0', 1600, 900),
    gallery: [sq(941861), sq(1267320), sq(6248864), sq(262978), sq(958545), sq(696218)],
    dishes: [p(941861, 600, 400), p(1267320, 600, 400), p(6248864, 600, 400)],
  },
  nonprofit: {
    hero: p(3184292),
    gallery: [p(3184418, 900, 600), p(7688336, 900, 600), p(3184292, 900, 600)],
    community: p(3184292, 800, 600),
  },
  spanish: {
    hero: u('1559339352-11d035aa65de', 1600, 900),
    tapas: [p(958545, 600, 400), p(696218, 600, 400), p(262978, 600, 400), p(1267320, 600, 400)],
    gallery: [
      sq(958545),
      sq(696218),
      sq(262978),
      sq(941861),
      sq(1267320),
      sq(6248864),
      sq(7049655),
      sq(1639562),
    ],
  },
  foodblog: {
    hero: p(5938421),
    posts: [p(6248864, 600, 750), p(262978, 600, 750), p(7049655, 600, 750)],
    gallery: [sq(6248864), sq(262978), sq(7049655), sq(5938421), sq(696218), sq(1267320)],
    newsletter: p(5938421, 1400, 600),
  },
  italian: {
    hero: u('1513104890138-7c749659a591', 1600, 900),
    gallery: [sq(1279330), sq(262978), sq(6248864), sq(1267320), sq(941861), sq(696218)],
    menu: [p(1279330, 600, 400), p(262978, 600, 400), p(6248864, 600, 400), p(1267320, 600, 400)],
    interior: p(1267320, 900, 600),
  },
  renewable: {
    hero: p(9875446),
    gallery: [
      p(159397, 900, 600),
      p(4483610, 900, 600),
      p(159243, 900, 600),
      p(442150, 900, 600),
      p(3860202, 900, 600),
      p(356049, 900, 600),
    ],
    services: [
      p(159397, 600, 400),
      p(4483610, 600, 400),
      p(159243, 600, 400),
      p(442150, 600, 400),
      p(3860202, 600, 400),
    ],
    technician: p(442150, 800, 600),
    ev: p(4483610, 800, 600),
  },
  /**
   * Moda premium — Unsplash (editorial) + Pexels (productos/lookbook).
   * Ideal: Unsplash hero + mix Kaboompics-style mood vía Unsplash fashion.
   */
  fashion: {
    hero: u('1469334031218-e382a71b716b', 1920, 1080),
    campaign: u('1483985988355-763728e1935b', 1600, 900),
    lookbook: [
      u('1515886657613-9f3515b0c78f', 800, 1000),
      u('1539109136881-3be0616acf4b', 800, 1000),
      u('1490481651871-ab68de25d43d', 800, 1000),
      p(1926769, 800, 1000),
      p(1043474, 800, 1000),
      p(994523, 800, 1000),
      p(2983468, 800, 1000),
      p(1126993, 800, 1000),
    ],
    products: [
      p(1926769, 600, 800),
      p(1043474, 600, 800),
      p(1152077, 600, 800),
      p(1464625, 600, 800),
      u('1584917865442-de89df76afd3', 600, 800),
      u('1543163521-1bf539c55dd2', 600, 800),
      p(934070, 600, 800),
      p(996329, 600, 800),
    ],
    men: u('1617137968427-85924c800a22', 900, 1100),
    women: u('1487222477894-8943e31ef7b2', 900, 1100),
    shoes: p(1464625, 900, 1100),
    accessories: p(1152077, 900, 1100),
    gallery: [
      usq('1509631179647-0177331693ae', 800),
      usq('1529139574466-a302c27e3844', 800),
      sq(994523, 800),
      sq(2983468, 800),
      sq(837140, 800),
      sq(1055691, 800),
      usq('1496747611176-843222e1e57c', 800),
      sq(291762, 800),
    ],
  },
} as const;

export type ImageBankCategory = keyof typeof IMAGE_BANK;
export type ImageBankEntry = (typeof IMAGE_BANK)[ImageBankCategory];

export function imagesForVariant(variant: string): ImageBankEntry {
  if (variant in IMAGE_BANK) return IMAGE_BANK[variant as ImageBankCategory];
  return IMAGE_BANK.cafe;
}

/** URLs únicas para incluir en prompts IA */
export function imageBriefForVariant(variant: string): string {
  const bank = imagesForVariant(variant);
  const lines: string[] = [];
  for (const [key, val] of Object.entries(bank)) {
    if (typeof val === 'string') lines.push(`${key}: ${val}`);
    else if (Array.isArray(val)) lines.push(`${key}: ${val.join(', ')}`);
  }
  return lines.join('\n');
}
