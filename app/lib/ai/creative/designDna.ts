/**
 * Design DNA — identidad por sector + ejes creativos.
 * No es plantilla de página; es contrato visual.
 */

import type { CreativeBrief, CreativeSectorId } from './creativeBrief';
import type { ImageBankCategory } from '../imageBank';

export interface DesignDnaPalette {
  accent: string;
  dark: string;
  light: string;
  surface: string;
  muted: string;
  cssVars: Record<string, string>;
}

export interface DesignDnaTypography {
  heading: string;
  body: string;
  button: string;
  googleFontsUrl: string;
  scale: CreativeBrief['typeScale'];
}

export interface DesignDna {
  id: string;
  sectorId: CreativeSectorId;
  mood: string;
  palette: DesignDnaPalette;
  typography: DesignDnaTypography;
  imagePackKey: ImageBankCategory;
  iconStyle: CreativeBrief['iconStyle'];
  radius: 'sharp' | 'soft' | 'pill' | 'craft';
  motionLevel: 'none' | 'subtle' | 'present';
  forbiddenVisuals: string[];
  designStyle: string;
  /** From CreativeBrief */
  heroFamily: CreativeBrief['heroFamily'];
  density: CreativeBrief['density'];
  rhythm: CreativeBrief['rhythm'];
  uniquenessSeed: string;
  storytellingArc: string[];
}

type DnaBase = Omit<
  DesignDna,
  'id' | 'heroFamily' | 'density' | 'rhythm' | 'uniquenessSeed' | 'storytellingArc' | 'typography'
> & { typography: Omit<DesignDnaTypography, 'scale'> };

const DNA_BY_SECTOR: Record<CreativeSectorId, DnaBase> = {
  clinic: {
    sectorId: 'clinic',
    mood: 'clinicalLight',
    palette: {
      accent: '#2A9D8F',
      dark: '#1A2B3C',
      light: '#F7FBFC',
      surface: '#FFFFFF',
      muted: '#5C6B7A',
      cssVars: {
        '--cua-accent': '#2A9D8F',
        '--cua-dark': '#1A2B3C',
        '--cua-light': '#F7FBFC',
        '--cua-surface': '#FFFFFF',
        '--cua-muted': '#5C6B7A',
      },
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'DM Sans',
      button: 'DM Sans',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@400;500;600&display=swap',
    },
    imagePackKey: 'clinic',
    iconStyle: 'line',
    radius: 'craft',
    motionLevel: 'subtle',
    forbiddenVisuals: ['fashion runway', 'neon cyber', 'dark gothic', 'SaaS soft UI'],
    designStyle: 'Clinical luxury: quiet chrome, immersive photography, craft radius, trust without SaaS soft.',
  },
  restaurant: {
    sectorId: 'restaurant',
    mood: 'gastronomicEmotion',
    palette: {
      accent: '#C45C26',
      dark: '#1C1410',
      light: '#FBF6F0',
      surface: '#FFF9F3',
      muted: '#6B5344',
      cssVars: {
        '--cua-accent': '#C45C26',
        '--cua-dark': '#1C1410',
        '--cua-light': '#FBF6F0',
        '--cua-surface': '#FFF9F3',
        '--cua-muted': '#6B5344',
      },
    },
    typography: {
      heading: 'Libre Baskerville',
      body: 'Source Sans 3',
      button: 'Source Sans 3',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600&display=swap',
    },
    imagePackKey: 'italian',
    iconStyle: 'emoji',
    radius: 'craft',
    motionLevel: 'present',
    forbiddenVisuals: ['corporate blue', 'SaaS cards', 'stock handshake'],
    designStyle: 'Photo-led Italian dining: warmth, plated food, emotional typography.',
  },
  legal: {
    sectorId: 'legal',
    mood: 'soberCorporate',
    palette: {
      accent: '#8B7355',
      dark: '#12141A',
      light: '#F4F2EE',
      surface: '#FFFFFF',
      muted: '#5A5E66',
      cssVars: {
        '--cua-accent': '#8B7355',
        '--cua-dark': '#12141A',
        '--cua-light': '#F4F2EE',
        '--cua-surface': '#FFFFFF',
        '--cua-muted': '#5A5E66',
      },
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Libre Franklin',
      button: 'Libre Franklin',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap',
    },
    imagePackKey: 'legal',
    iconStyle: 'line',
    radius: 'sharp',
    motionLevel: 'none',
    forbiddenVisuals: ['emoji clutter', 'neon', 'playful illustration'],
    designStyle: 'Sober legal: hairline rules, bronze accent, type-led confidence.',
  },
  hotel: {
    sectorId: 'hotel',
    mood: 'aspirationalLuxury',
    palette: {
      accent: '#B89B6A',
      dark: '#1A1814',
      light: '#F8F4EC',
      surface: '#FFFDF8',
      muted: '#7A7164',
      cssVars: {
        '--cua-accent': '#B89B6A',
        '--cua-dark': '#1A1814',
        '--cua-light': '#F8F4EC',
        '--cua-surface': '#FFFDF8',
        '--cua-muted': '#7A7164',
      },
    },
    typography: {
      heading: 'Cinzel',
      body: 'Josefin Sans',
      button: 'Josefin Sans',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Josefin+Sans:wght@300;400;600&display=swap',
    },
    imagePackKey: 'hotel',
    iconStyle: 'line',
    radius: 'craft',
    motionLevel: 'subtle',
    forbiddenVisuals: ['budget motel look', 'clipart', 'harsh neon'],
    designStyle: 'Boutique hotel: aspirational photography, gold whisper, calm luxury.',
  },
  architecture: {
    sectorId: 'architecture',
    mood: 'spatialMinimal',
    palette: {
      accent: '#111111',
      dark: '#0D0D0D',
      light: '#FFFFFF',
      surface: '#FAFAFA',
      muted: '#6E6E6E',
      cssVars: {
        '--cua-accent': '#111111',
        '--cua-dark': '#0D0D0D',
        '--cua-light': '#FFFFFF',
        '--cua-surface': '#FAFAFA',
        '--cua-muted': '#6E6E6E',
      },
    },
    typography: {
      heading: 'Space Grotesk',
      body: 'Manrope',
      button: 'Manrope',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap',
    },
    imagePackKey: 'architecture',
    iconStyle: 'none',
    radius: 'sharp',
    motionLevel: 'subtle',
    forbiddenVisuals: ['ornate flourishes', 'stock team photos', 'rounded candy UI'],
    designStyle: 'Spatial minimal: large photography, white field, precise type.',
  },
  cafe: {
    sectorId: 'cafe',
    mood: 'warmNeighborhood',
    palette: {
      accent: '#A67C52',
      dark: '#2C1810',
      light: '#F5EDE4',
      surface: '#FFF8F1',
      muted: '#7A5C45',
      cssVars: {
        '--cua-accent': '#A67C52',
        '--cua-dark': '#2C1810',
        '--cua-light': '#F5EDE4',
        '--cua-surface': '#FFF8F1',
        '--cua-muted': '#7A5C45',
      },
    },
    typography: {
      heading: 'Fraunces',
      body: 'Nunito Sans',
      button: 'Nunito Sans',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Nunito+Sans:wght@400;600&display=swap',
    },
    imagePackKey: 'cafe',
    iconStyle: 'emoji',
    radius: 'soft',
    motionLevel: 'present',
    forbiddenVisuals: ['purple SaaS', 'cold clinical'],
    designStyle: 'Neighborhood café: warm browns, food photography, hospitality.',
  },
  barber: {
    sectorId: 'barber',
    mood: 'darkCraft',
    palette: {
      accent: '#C9A961',
      dark: '#0F0F0F',
      light: '#1A1A1A',
      surface: '#141414',
      muted: '#A0A0A0',
      cssVars: {
        '--cua-accent': '#C9A961',
        '--cua-dark': '#0F0F0F',
        '--cua-light': '#1A1A1A',
        '--cua-surface': '#141414',
        '--cua-muted': '#A0A0A0',
      },
    },
    typography: {
      heading: 'Oswald',
      body: 'Lato',
      button: 'Lato',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Oswald:wght@500;600&display=swap',
    },
    imagePackKey: 'barber',
    iconStyle: 'line',
    radius: 'sharp',
    motionLevel: 'subtle',
    forbiddenVisuals: ['fashion stock', 'women beauty salon only', 'pastel'],
    designStyle: 'Barbershop noir-gold: craft photography, contrast, never fashion.',
  },
  bakery: {
    sectorId: 'bakery',
    mood: 'earthyArtisan',
    palette: {
      accent: '#C68E6B',
      dark: '#2B2118',
      light: '#FBF7F2',
      surface: '#FFFFFF',
      muted: '#7A6A5A',
      cssVars: {
        '--cua-accent': '#C68E6B',
        '--cua-dark': '#2B2118',
        '--cua-light': '#FBF7F2',
        '--cua-surface': '#FFFFFF',
        '--cua-muted': '#7A6A5A',
      },
    },
    typography: {
      heading: 'Literata',
      body: 'Karla',
      button: 'Karla',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Karla:wght@400;600&family=Literata:wght@500;600&display=swap',
    },
    imagePackKey: 'bakery',
    iconStyle: 'emoji',
    radius: 'soft',
    motionLevel: 'subtle',
    forbiddenVisuals: ['boats', 'cocktails', 'fashion'],
    designStyle: 'Artisan bakery: flour, crust, warm light.',
  },
  corporate: {
    sectorId: 'corporate',
    mood: 'soberCorporate',
    palette: {
      accent: '#1B4F72',
      dark: '#0D1B2A',
      light: '#F5F7FA',
      surface: '#FFFFFF',
      muted: '#5D6D7E',
      cssVars: {
        '--cua-accent': '#1B4F72',
        '--cua-dark': '#0D1B2A',
        '--cua-light': '#F5F7FA',
        '--cua-surface': '#FFFFFF',
        '--cua-muted': '#5D6D7E',
      },
    },
    typography: {
      heading: 'Merriweather',
      body: 'IBM Plex Sans',
      button: 'IBM Plex Sans',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=Merriweather:wght@400;700&display=swap',
    },
    imagePackKey: 'corporate',
    iconStyle: 'line',
    radius: 'soft',
    motionLevel: 'none',
    forbiddenVisuals: ['neon', 'meme emoji'],
    designStyle: 'Corporate advisory: calm blues, clarity, trust.',
  },
  fashion: {
    sectorId: 'fashion',
    mood: 'aspirationalLuxury',
    palette: {
      accent: '#111111',
      dark: '#0A0A0A',
      light: '#F5F5F5',
      surface: '#FFFFFF',
      muted: '#666666',
      cssVars: {
        '--cua-accent': '#111111',
        '--cua-dark': '#0A0A0A',
        '--cua-light': '#F5F5F5',
        '--cua-surface': '#FFFFFF',
        '--cua-muted': '#666666',
      },
    },
    typography: {
      heading: 'Bodoni Moda',
      body: 'Jost',
      button: 'Jost',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;600&family=Jost:wght@400;500&display=swap',
    },
    imagePackKey: 'fashion',
    iconStyle: 'none',
    radius: 'sharp',
    motionLevel: 'present',
    forbiddenVisuals: ['corporate stock', 'clinic teal'],
    designStyle: 'Editorial fashion: contrast, lookbook, type drama.',
  },
  default: {
    sectorId: 'default',
    mood: 'balanced',
    palette: {
      accent: '#3D5A5B',
      dark: '#1C2526',
      light: '#F7F6F3',
      surface: '#FFFFFF',
      muted: '#667070',
      cssVars: {
        '--cua-accent': '#3D5A5B',
        '--cua-dark': '#1C2526',
        '--cua-light': '#F7F6F3',
        '--cua-surface': '#FFFFFF',
        '--cua-muted': '#667070',
      },
    },
    typography: {
      heading: 'Fraunces',
      body: 'Work Sans',
      button: 'Work Sans',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Work+Sans:wght@400;600&display=swap',
    },
    imagePackKey: 'default',
    iconStyle: 'line',
    radius: 'soft',
    motionLevel: 'subtle',
    forbiddenVisuals: ['generic purple gradient AI look'],
    designStyle: 'Clear professional presence with distinctive type.',
  },
};

export function resolveDesignDna(brief: CreativeBrief): DesignDna {
  const base = DNA_BY_SECTOR[brief.sectorId] || DNA_BY_SECTOR.default;
  // Medicina estética: por tone LLM O por señales del brief (no depender solo del LLM)
  const luxuryAesthetic =
    brief.sectorId === 'clinic' &&
    (brief.artDirection === 'aspirationalLuxury' ||
      brief.brandTone === 'luxury' ||
      isAestheticMedicineBrief(brief));
  const palette = luxuryAesthetic
    ? {
        accent: '#B8A078',
        dark: '#1C1A17',
        light: '#FAF8F4',
        surface: '#FFFFFF',
        muted: '#6B6560',
        cssVars: {
          '--cua-accent': '#B8A078',
          '--cua-dark': '#1C1A17',
          '--cua-light': '#FAF8F4',
          '--cua-surface': '#FFFFFF',
          '--cua-muted': '#6B6560',
          '--cua-sage': '#A8B5A0',
        },
      }
    : base.palette;
  const designStyle = luxuryAesthetic
    ? 'Luxury aesthetic medicine: ivory air, subtle gold, soft sage, editorial serif, never hotel suites.'
    : base.designStyle;
  const luxuryType = {
    heading: 'Cormorant Garamond',
    body: 'Outfit',
    button: 'Outfit',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap',
  };
  const typeScale =
    luxuryAesthetic && (brief.density === 'sparse' || brief.typeScale === 'editorial')
      ? ('billboard' as const)
      : luxuryAesthetic && brief.typeScale === 'intimate'
        ? ('intimate' as const)
        : brief.typeScale;
  return {
    ...base,
    id: `dna-${brief.sectorId}-${brief.uniquenessSeed.slice(0, 8)}`,
    palette,
    designStyle,
    mood: luxuryAesthetic ? 'aspirationalLuxury' : base.mood,
    radius: luxuryAesthetic || brief.brandTone === 'luxury' || brief.brandTone === 'editorial'
      ? 'craft'
      : base.radius,
    imagePackKey: luxuryAesthetic ? 'aestheticClinic' : base.imagePackKey,
    heroFamily: brief.heroFamily,
    density: brief.density,
    rhythm: brief.rhythm,
    uniquenessSeed: brief.uniquenessSeed,
    storytellingArc: brief.storytellingArc,
    iconStyle: brief.iconStyle,
    typography: {
      ...(luxuryAesthetic ? luxuryType : base.typography),
      scale: typeScale,
    },
  };
}

/** Señales de medicina estética / med-spa (vs clínica dental genérica). */
export function isAestheticMedicineBrief(
  brief: Pick<CreativeBrief, 'businessName' | 'positioning' | 'services' | 'aboutHeadline' | 'aboutBody' | 'heroTitle' | 'heroSubtitle' | 'primaryCta'>
): boolean {
  const blob = [
    brief.businessName,
    brief.positioning,
    brief.aboutHeadline,
    brief.aboutBody,
    brief.heroTitle,
    brief.heroSubtitle,
    brief.primaryCta,
    ...(brief.services || []),
  ]
    .join(' ')
    .toLowerCase();
  return /est[eé]tic|aesthetic|med[\s-]?spa|hialuron|neuromod|skinbooster|botox|peeling|l[aá]ser\s+dermat|bioestimul|rejuvenec|medicina\s+est/i.test(
    blob
  );
}

export function isAestheticMedicinePrompt(prompt: string): boolean {
  return /est[eé]tic|aesthetic|med[\s-]?spa|hialuron|neuromod|skinbooster|botox|peeling|l[aá]ser\s+dermat|bioestimul|rejuvenec|medicina\s+est/i.test(
    prompt
  );
}

export function listDesignDnaSectors(): CreativeSectorId[] {
  return Object.keys(DNA_BY_SECTOR) as CreativeSectorId[];
}
