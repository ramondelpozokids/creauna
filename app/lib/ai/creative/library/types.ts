/**
 * Creative Director library — layout & component metadata types.
 */

export type LayoutGoal = 'conversion' | 'brand' | 'storytelling' | 'booking' | 'lead';
export type LayoutStyle =
  | 'editorial'
  | 'corporate'
  | 'luxury'
  | 'warm'
  | 'minimal'
  | 'dark'
  | 'clinical';

export interface LayoutMeta {
  id: string;
  name: string;
  /** CreativeSectorId values or '*' for universal */
  sectors: string[];
  goals: LayoutGoal[];
  styles: LayoutStyle[];
  conversion: 1 | 2 | 3 | 4 | 5;
  storytelling: 1 | 2 | 3 | 4 | 5;
  heroFamily: string;
  sectionOrder: string[];
  asymmetry: boolean;
}

export interface ComponentMeta {
  id: string;
  family:
    | 'hero'
    | 'nav'
    | 'card'
    | 'footer'
    | 'cta'
    | 'testimonial'
    | 'faq'
    | 'form'
    | 'features'
    | 'gallery'
    | 'about';
  name: string;
  whenToUse: string;
  sectors: string[];
}
