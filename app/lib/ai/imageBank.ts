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
  /** Panadería / bollería / pastelería — solo pan, bollería, tartas (nunca barcos/copas). */
  bakery: {
    hero: u('1509440157545-e4a8dfd7c9e5', 1600, 900),
    gallery: [
      u('1549931319-a545dcf3bc73', 900, 600),
      u('1555507036-ab1f4038808a', 900, 600),
      u('1517433670267-bdf211faa8b8', 900, 600),
      u('1568254183919-70af027f3f4a', 900, 600),
      u('1578985545062-69928b1d9587', 900, 600),
      u('1608198093002-ed4b0e0a0d8', 900, 600),
      p(1775043, 900, 600),
      p(209206, 900, 600),
      p(1070850, 900, 600),
      p(1126359, 900, 600),
      p(291528, 900, 600),
      p(205961, 900, 600),
    ],
    bread: [
      u('1549931319-a545dcf3bc73', 600, 400),
      u('1509440157545-e4a8dfd7c9e5', 600, 400),
      p(1775043, 600, 400),
      p(209206, 600, 400),
      p(1070850, 600, 400),
      p(205961, 600, 400),
    ],
    pastry: [
      u('1555507036-ab1f4038808a', 600, 400),
      u('1568254183919-70af027f3f4a', 600, 400),
      u('1608198093002-ed4b0e0a0d8', 600, 400),
      p(291528, 600, 400),
    ],
    cakes: [
      u('1578985545062-69928b1d9587', 600, 400),
      p(1126359, 600, 400),
      p(291528, 600, 400),
      u('1464349095431-88bce0c0d0e8', 600, 400),
    ],
    about: u('1517433670267-bdf211faa8b8', 900, 1100),
    workshop: p(1070850, 900, 600),
  },
  kebab: {
    hero: p(2964195),
    gallery: [p(7049655, 900, 600), p(1639562, 900, 600), p(2964168, 900, 600)],
    menu: [p(1639562, 600, 400), p(2964168, 600, 400), p(5938421, 600, 400), p(7049655, 600, 400)],
  },
  tattoo: {
    hero: p(955938),
    gallery: [p(955938, 900, 600), p(356567, 900, 600), p(6624833, 900, 600), p(1310522, 900, 600), p(2113994, 900, 600)],
    portfolio: [p(955938, 600, 400), p(356567, 600, 400), p(6624833, 600, 400), p(1310522, 600, 400)],
  },
  beauty: {
    hero: u('1560066984-138dadb4c035', 1600, 900),
    gallery: [sq(3992858), sq(373834), sq(3993449), sq(3992219), sq(3992876), sq(3992870)],
    services: [p(3993449, 600, 400), p(373834, 600, 400), p(3992876, 600, 400), p(3992219, 600, 400)],
  },
  /** Barbería — URLs exactas de referencia (Desktop/barberia.html). Nunca moda. */
  barber: {
    hero: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80',
    about: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b7f30a?w=600&q=80',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
      'https://images.unsplash.com/photo-1512864084360-7c0c4d0ce038?w=600&q=80',
      'https://images.unsplash.com/photo-1620331311520-246429473913?w=600&q=80',
    ],
    shop: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=80',
    tools: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80',
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
  /** Bicicletas / ciclismo — fotos de bici, no motos ni moda. */
  bike: {
    hero: u('1541625602330-2277a4c46182', 1600, 900),
    gallery: [
      u('1485965120184-e220f721d03e', 900, 600),
      u('1576435728678-68d0fbf94e91', 900, 600),
      u('1511994298241-608b331cdf63', 900, 600),
      u('1558618666-fcd25c85cd64', 900, 600),
      p(100582, 900, 600),
      p(276517, 900, 600),
      u('1571333250630-f0230c320b6d', 900, 600),
      u('1505705694340-019e1e335916', 900, 600),
    ],
    mtb: u('1571333250630-f0230c320b6d', 900, 600),
    road: u('1485965120184-e220f721d03e', 900, 600),
    ebike: u('1532298229144-0ec0c57515c7', 900, 600),
    workshop: p(3802510, 900, 600),
    accessories: u('1471506480208-7e4859c702a9', 900, 600),
  },
  luxury: {
    hero: u('1414235077428-338989a2e8c0', 1600, 900),
    gallery: [
      u('1566073771259-6a8506099945', 900, 600),
      u('1542314831-068cd1dbfeeb', 900, 600),
      u('1520255672679-06643ba8b5c9', 900, 600),
      sq(262978),
      u('1551882547-ff40c63fe5fa', 900, 600),
      u('1578683010236-d716f9a3f461', 900, 600),
    ],
    dishes: [p(262978, 600, 400), u('1414235077428-338989a2e8c0', 600, 400), u('1551882547-ff40c63fe5fa', 600, 400)],
  },
  jewelry: {
    hero: u('1515562141207-7a88fb7ce338', 1600, 900),
    gallery: [
      u('1599643478513-4e0d76dc7df4', 900, 600),
      u('1605100804763-247f67b3557e', 900, 600),
      u('1617038260897-41a1f1426c25', 900, 600),
      u('1602173574767-37ac01994b2a', 900, 600),
      usq('1573408301185-914bb3195a4c', 800),
      usq('1515562141207-7a88fb7ce338', 800),
    ],
    products: [
      u('1605100804763-247f67b3557e', 600, 800),
      u('1617038260897-41a1f1426c25', 600, 800),
      u('1602173574767-37ac01994b2a', 600, 800),
      u('1599643478513-4e0d76dc7df4', 600, 800),
    ],
  },
  /** Editorial neutro — fallback cuando el sector no tiene pack dedicado (nunca café). */
  default: {
    hero: u('1497366216548-37526070297c', 1600, 900),
    gallery: [
      p(3184292, 900, 600),
      p(3184418, 900, 600),
      p(7688336, 900, 600),
      p(3861969, 900, 600),
      u('1522071820081-009f0129c71c', 900, 600),
      p(577585, 900, 600),
    ],
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
  /** Clínica dental / salud general (sillón, luz clínica — no spa lujo) */
  clinic: {
    hero: u('1629909613654-28e377c37b09', 1600, 900),
    about: u('1576091160399-112ba8d25d1d', 900, 1100),
    gallery: [
      u('1519494026892-80bbd2d6fd0d', 900, 600),
      u('1576091160399-112ba8d25d1d', 900, 600),
      u('1559839734-2b71ea197ec2', 900, 600),
      u('1588776814546-1ffcf47267a5', 900, 600),
      u('1629909615184-74f495363b67', 900, 600),
      u('1606811841689-23dfddce3e95', 900, 600),
    ],
    services: [
      u('1576091160399-112ba8d25d1d', 600, 400),
      u('1559839734-2b71ea197ec2', 600, 400),
      u('1606811841689-23dfddce3e95', 600, 400),
    ],
  },
  /**
   * Medicina estética / med-spa premium — piel, calma, tratamiento facial.
   * Nunca sillón dental ni suites de hotel. IDs verificados HTTP 200.
   */
  aestheticClinic: {
    hero: u('1570172619644-dfd03ed5d881', 1600, 900),
    about: u('1544161515-4ab6ce6db874', 900, 1100),
    heroes: [
      u('1570172619644-dfd03ed5d881', 1600, 900),
      u('1600334129128-685c5582fd35', 1600, 900),
      u('1560066984-138dadb4c035', 1600, 900),
      u('1522337360788-8b13dee7a37e', 1600, 900),
    ],
    gallery: [
      u('1570172619644-dfd03ed5d881', 900, 600),
      u('1600334129128-685c5582fd35', 900, 600),
      u('1544161515-4ab6ce6db874', 900, 600),
      u('1556228453-efd6c1ff04f6', 900, 600),
      u('1556228720-195a672e8a03', 900, 600),
      u('1556228578-8c89e6adf883', 900, 600),
      u('1522335789203-aabd1fc54bc9', 900, 600),
      u('1522338140262-f46f5913618a', 900, 600),
      u('1560066984-138dadb4c035', 900, 600),
      p(3993449, 900, 600),
      p(3992876, 900, 600),
      p(3992858, 900, 600),
    ],
    services: [
      u('1570172619644-dfd03ed5d881', 600, 400),
      u('1600334129128-685c5582fd35', 600, 400),
      u('1556228453-efd6c1ff04f6', 600, 400),
      p(3993449, 600, 400),
    ],
  },
  /** Abogados / legal */
  legal: {
    hero: u('1589829545856-d10d557cf95f', 1600, 900),
    about: u('1450101499163-c8848c66ca85', 900, 1100),
    gallery: [
      u('1497366811353-68707447154d', 900, 600),
      u('1454165804606-c3d57bc86b40', 900, 600),
      p(5668858, 900, 600),
      p(5668473, 900, 600),
      p(7873557, 900, 600),
      u('1521791136064-622dba8850ea', 900, 600),
    ],
  },
  /** Hotel boutique / hospitality */
  hotel: {
    hero: u('1566073771259-6a8506099945', 1600, 900),
    about: u('1611892440504-42a792e24d32', 900, 1100),
    gallery: [
      u('1631049307264-da0ec9d70304', 900, 600),
      u('1590490360182-c33d57733427', 900, 600),
      u('1582719478250-c89cae4dc85b', 900, 600),
      p(258154, 900, 600),
      p(271624, 900, 600),
      p(1838550, 900, 600),
    ],
    rooms: [u('1631049307264-da0ec9d70304', 800, 1000), u('1611892440504-42a792e24d32', 800, 1000)],
  },
  /** Arquitectura / estudio */
  architecture: {
    hero: u('1487958449943-2429e8be8625', 1600, 900),
    about: u('1503387762-592deb58ef4e', 900, 1100),
    gallery: [
      u('1511818966892-1b0f8d4c0f3d', 900, 600),
      u('1600607687939-ce8a6c25118c', 900, 600),
      u('1600585154340-be6161a56a0c', 900, 600),
      p(323780, 900, 600),
      p(1396122, 900, 600),
      p(1571460, 900, 600),
    ],
    projects: [u('1487958449943-2429e8be8625', 900, 1100), u('1600607687939-ce8a6c25118c', 900, 1100)],
  },
} as const;

export type ImageBankCategory = keyof typeof IMAGE_BANK;
export type ImageBankEntry = (typeof IMAGE_BANK)[ImageBankCategory];

export function imagesForVariant(variant: string): ImageBankEntry {
  if (variant === 'bakery') return IMAGE_BANK.bakery;
  if (variant === 'barber') return IMAGE_BANK.barber;
  if (variant in IMAGE_BANK) return IMAGE_BANK[variant as ImageBankCategory];
  return IMAGE_BANK.default;
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
