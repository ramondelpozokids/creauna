/** Imágenes reales (Pexels/Unsplash) — sin placeholders. Usar URLs estables con parámetros de crop. */
const p = (id: number, w = 1400, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const sq = (id: number, size = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${size}&h=${size}&fit=crop`;

export const IMAGE_BANK = {
  cafe: {
    hero: p(6261332),
    gallery: [sq(941861), sq(1267320), sq(6248864), sq(958545), sq(696218), sq(1023613)],
    menu: [p(941861, 600, 400), p(6248864, 600, 400), p(958545, 600, 400), p(696218, 600, 400)],
    interior: p(1267320, 900, 600),
    terrace: p(6261332, 900, 600),
    cocktails: [sq(1023613), sq(1267320), sq(6248864)],
  },
  kebab: {
    hero: p(2964195),
    gallery: [p(7049655, 900, 600), p(1639562, 900, 600), p(2964168, 900, 600)],
    menu: [p(1639562, 600, 400), p(2964168, 600, 400), p(5938421, 600, 400), p(7049655, 600, 400)],
  },
  tattoo: {
    hero: p(1874644),
    gallery: [p(955938, 900, 600), p(356567, 900, 600), p(6624833, 900, 600)],
    portfolio: [p(1874644, 600, 400), p(955938, 600, 400), p(356567, 600, 400), p(6624833, 600, 400)],
  },
  beauty: {
    hero: p(3993449),
    gallery: [sq(3992858), sq(373834), sq(3993449), sq(3992219), sq(3992876), sq(3992870)],
    services: [p(3993449, 600, 400), p(373834, 600, 400), p(3992876, 600, 400), p(3992219, 600, 400)],
  },
  corporate: {
    hero: p(672358, 1600, 900),
    madrid: p(3379864, 1600, 900),
    gallery: [
      p(3184292, 900, 600),
      p(3184418, 900, 600),
      p(7688336, 900, 600),
      p(3861969, 900, 600),
      p(1181675, 900, 600),
      p(577585, 900, 600),
      p(271624, 900, 600),
      p(189296, 900, 600),
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
    hero: p(262978),
    gallery: [sq(941861), sq(1267320), sq(6248864), sq(262978), sq(958545), sq(696218)],
    dishes: [p(941861, 600, 400), p(1267320, 600, 400), p(6248864, 600, 400)],
  },
  nonprofit: {
    hero: p(3184292),
    gallery: [p(3184418, 900, 600), p(7688336, 900, 600), p(3184292, 900, 600)],
    community: p(3184292, 800, 600),
  },
  spanish: {
    hero: p(941861),
    tapas: [p(958545, 600, 400), p(696218, 600, 400), p(262978, 600, 400), p(1267320, 600, 400)],
    gallery: [sq(958545), sq(696218), sq(262978), sq(941861), sq(1267320), sq(6248864),
      sq(7049655), sq(1639562), sq(2964168), sq(5938421), sq(60616), sq(958545)],
  },
  foodblog: {
    hero: p(5938421),
    posts: [p(6248864, 600, 750), p(262978, 600, 750), p(7049655, 600, 750)],
    gallery: [sq(6248864), sq(262978), sq(7049655), sq(5938421), sq(696218), sq(1267320)],
    newsletter: p(5938421, 1400, 600),
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
