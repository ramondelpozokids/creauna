/**
 * Creative Director — component library metadata.
 */

import type { ComponentMeta } from './types';

export const COMPONENT_LIBRARY: ComponentMeta[] = [
  // —— Heroes (≥8 required; 12 sector-tuned) ——
  {
    id: 'hero-editorial',
    family: 'hero',
    name: 'Editorial Hero',
    whenToUse: 'Magazine-style opening with strong type hierarchy and a single photographic beat.',
    sectors: ['fashion', 'architecture', 'default', '*'],
  },
  {
    id: 'hero-corporate',
    family: 'hero',
    name: 'Corporate Hero',
    whenToUse: 'Clear value proposition and primary CTA for B2B or professional services.',
    sectors: ['corporate', 'legal', 'default'],
  },
  {
    id: 'hero-saas',
    family: 'hero',
    name: 'SaaS Product Hero',
    whenToUse: 'Product-led landing with demo or signup emphasis and feature teaser.',
    sectors: ['corporate', 'default', '*'],
  },
  {
    id: 'hero-luxury',
    family: 'hero',
    name: 'Luxury Hero',
    whenToUse: 'Sparse copy, large imagery, and restrained CTA for premium brands.',
    sectors: ['fashion', 'hotel', 'architecture'],
  },
  {
    id: 'hero-startup',
    family: 'hero',
    name: 'Startup Launch Hero',
    whenToUse: 'High-energy launch messaging with waitlist or early-access conversion.',
    sectors: ['default', 'corporate', '*'],
  },
  {
    id: 'hero-product',
    family: 'hero',
    name: 'Product Showcase Hero',
    whenToUse: 'Object or SKU as the visual anchor with short benefit line and buy/learn CTA.',
    sectors: ['fashion', 'bakery', 'default'],
  },
  {
    id: 'hero-realestate',
    family: 'hero',
    name: 'Real Estate Hero',
    whenToUse: 'Property or neighborhood atmosphere with search or valuation CTA.',
    sectors: ['architecture', 'corporate', 'default'],
  },
  {
    id: 'hero-restaurant',
    family: 'hero',
    name: 'Restaurant Hero',
    whenToUse: 'Appetite-driven full-bleed food or room photography with reserve CTA.',
    sectors: ['restaurant', 'cafe', 'hotel'],
  },
  {
    id: 'hero-clinic',
    family: 'hero',
    name: 'Clinic Hero',
    whenToUse: 'Calm, trustworthy clinical opening with appointment or consultation CTA.',
    sectors: ['clinic'],
  },
  {
    id: 'hero-hotel',
    family: 'hero',
    name: 'Hotel Hero',
    whenToUse: 'Aspirational stay imagery with dates/booking CTA in the first viewport.',
    sectors: ['hotel'],
  },
  {
    id: 'hero-architecture',
    family: 'hero',
    name: 'Architecture Hero',
    whenToUse: 'Spatial photography and project title emphasis for studios and portfolios.',
    sectors: ['architecture'],
  },
  {
    id: 'hero-barber',
    family: 'hero',
    name: 'Barber Hero',
    whenToUse: 'Craft/dark mood with services and book-now CTA for barbershops.',
    sectors: ['barber'],
  },

  // —— Navs (≥3) ——
  {
    id: 'nav-minimal-link',
    family: 'nav',
    name: 'Minimal Link Nav',
    whenToUse: 'Few destinations, transparent or light bar; keeps focus on the hero.',
    sectors: ['*', 'fashion', 'architecture'],
  },
  {
    id: 'nav-corporate-utility',
    family: 'nav',
    name: 'Corporate Utility Nav',
    whenToUse: 'Logo, multi-link menu, and primary CTA button for lead-gen sites.',
    sectors: ['corporate', 'legal', 'clinic', 'default'],
  },
  {
    id: 'nav-hospitality-book',
    family: 'nav',
    name: 'Hospitality Book Nav',
    whenToUse: 'Always-visible Book / Reserve action for hotels, restaurants, barbers.',
    sectors: ['hotel', 'restaurant', 'barber', 'cafe'],
  },
  {
    id: 'nav-sticky-dark',
    family: 'nav',
    name: 'Sticky Dark Nav',
    whenToUse: 'Dark sticky chrome over full-bleed imagery for craft and luxury brands.',
    sectors: ['barber', 'fashion', 'hotel'],
  },

  // —— Cards (≥6) ——
  {
    id: 'card-service-icon',
    family: 'card',
    name: 'Service Icon Card',
    whenToUse: 'Grid of services with optional icon; avoid in hero; use mid-page.',
    sectors: ['clinic', 'legal', 'corporate', 'default'],
  },
  {
    id: 'card-menu-item',
    family: 'card',
    name: 'Menu Item Card',
    whenToUse: 'Dish or drink listing with price and short description.',
    sectors: ['restaurant', 'cafe', 'bakery'],
  },
  {
    id: 'card-room-suite',
    family: 'card',
    name: 'Room / Suite Card',
    whenToUse: 'Accommodation or package with image, amenities, and book link.',
    sectors: ['hotel'],
  },
  {
    id: 'card-project-tile',
    family: 'card',
    name: 'Project Tile Card',
    whenToUse: 'Portfolio project with image, title, and typology tags.',
    sectors: ['architecture', 'fashion'],
  },
  {
    id: 'card-pricing-tier',
    family: 'card',
    name: 'Pricing Tier Card',
    whenToUse: 'Interactive plan selection; cards justified because users compare options.',
    sectors: ['corporate', 'barber', 'clinic', 'default'],
  },
  {
    id: 'card-team-member',
    family: 'card',
    name: 'Team Member Card',
    whenToUse: 'Portrait, role, and short bio for clinics, firms, and studios.',
    sectors: ['clinic', 'legal', 'architecture', 'corporate'],
  },
  {
    id: 'card-product-shop',
    family: 'card',
    name: 'Product Shop Card',
    whenToUse: 'Commerce tile for SKUs with image, price, and add/view action.',
    sectors: ['fashion', 'bakery', 'default'],
  },

  // —— Footers (≥4) ——
  {
    id: 'footer-columns-legal',
    family: 'footer',
    name: 'Columns Legal Footer',
    whenToUse: 'Multi-column links, address, and legal for professional sites.',
    sectors: ['legal', 'corporate', 'clinic', 'default'],
  },
  {
    id: 'footer-hospitality-contact',
    family: 'footer',
    name: 'Hospitality Contact Footer',
    whenToUse: 'Hours, map, phone, and social for F&B and hotels.',
    sectors: ['restaurant', 'cafe', 'hotel', 'bakery', 'barber'],
  },
  {
    id: 'footer-minimal-brand',
    family: 'footer',
    name: 'Minimal Brand Footer',
    whenToUse: 'Logo, one line, and sparse links for luxury/editorial brands.',
    sectors: ['fashion', 'architecture', 'hotel'],
  },
  {
    id: 'footer-newsletter',
    family: 'footer',
    name: 'Newsletter Footer',
    whenToUse: 'Email capture strip plus secondary links for brand communities.',
    sectors: ['fashion', 'cafe', 'default', '*'],
  },
  {
    id: 'footer-studio-credits',
    family: 'footer',
    name: 'Studio Credits Footer',
    whenToUse: 'Credits, press, and inquiry for architecture and creative studios.',
    sectors: ['architecture', 'fashion'],
  },

  // —— CTAs (≥4) ——
  {
    id: 'cta-band-primary',
    family: 'cta',
    name: 'Primary Band CTA',
    whenToUse: 'Full-width mid or end-page conversion band with one clear action.',
    sectors: ['*', 'corporate', 'default'],
  },
  {
    id: 'cta-booking-inline',
    family: 'cta',
    name: 'Inline Booking CTA',
    whenToUse: 'Compact book/reserve prompt near services or pricing.',
    sectors: ['hotel', 'restaurant', 'barber', 'clinic'],
  },
  {
    id: 'cta-split-media',
    family: 'cta',
    name: 'Split Media CTA',
    whenToUse: 'Image + copy + button when storytelling should precede the ask.',
    sectors: ['fashion', 'hotel', 'architecture', 'default'],
  },
  {
    id: 'cta-urgency-lead',
    family: 'cta',
    name: 'Urgency Lead CTA',
    whenToUse: 'Short deadline or capacity cue for legal intake or limited offers.',
    sectors: ['legal', 'clinic', 'corporate'],
  },
  {
    id: 'cta-soft-inquiry',
    family: 'cta',
    name: 'Soft Inquiry CTA',
    whenToUse: 'Low-pressure contact for luxury and architecture commissions.',
    sectors: ['architecture', 'fashion', 'hotel'],
  },

  // —— Testimonials (≥4) ——
  {
    id: 'testimonial-quote-large',
    family: 'testimonial',
    name: 'Large Quote Testimonial',
    whenToUse: 'One powerful quote as a storytelling beat between sections.',
    sectors: ['*', 'hotel', 'fashion'],
  },
  {
    id: 'testimonial-grid-faces',
    family: 'testimonial',
    name: 'Faces Grid Testimonials',
    whenToUse: 'Multiple client faces and short lines for trust-heavy sectors.',
    sectors: ['clinic', 'legal', 'corporate', 'barber'],
  },
  {
    id: 'testimonial-case-result',
    family: 'testimonial',
    name: 'Case Result Testimonial',
    whenToUse: 'Outcome-oriented story (metric + quote) for firms and clinics.',
    sectors: ['legal', 'clinic', 'corporate'],
  },
  {
    id: 'testimonial-review-stars',
    family: 'testimonial',
    name: 'Star Review Strip',
    whenToUse: 'Aggregate rating strip for local businesses with many reviews.',
    sectors: ['restaurant', 'cafe', 'barber', 'bakery', 'hotel'],
  },
  {
    id: 'testimonial-video-still',
    family: 'testimonial',
    name: 'Video Still Testimonial',
    whenToUse: 'Poster frame suggesting a patient/guest story video.',
    sectors: ['clinic', 'hotel', 'default'],
  },

  // —— FAQs (≥3) ——
  {
    id: 'faq-accordion-standard',
    family: 'faq',
    name: 'Standard Accordion FAQ',
    whenToUse: 'Default Q&A for services, pricing, and policies.',
    sectors: ['*', 'clinic', 'legal', 'corporate'],
  },
  {
    id: 'faq-two-column',
    family: 'faq',
    name: 'Two-Column FAQ',
    whenToUse: 'Dense FAQ without feeling endless; good for clinical and legal.',
    sectors: ['clinic', 'legal'],
  },
  {
    id: 'faq-booking-policies',
    family: 'faq',
    name: 'Booking Policies FAQ',
    whenToUse: 'Cancellation, deposits, and arrival rules for hospitality and barbers.',
    sectors: ['hotel', 'restaurant', 'barber', 'clinic'],
  },
  {
    id: 'faq-product-support',
    family: 'faq',
    name: 'Product Support FAQ',
    whenToUse: 'SaaS/product how-tos near pricing or CTA.',
    sectors: ['corporate', 'default'],
  },

  // —— Forms (≥3) ——
  {
    id: 'form-contact-simple',
    family: 'form',
    name: 'Simple Contact Form',
    whenToUse: 'Name, email, message — default lead capture.',
    sectors: ['*', 'default', 'corporate'],
  },
  {
    id: 'form-appointment',
    family: 'form',
    name: 'Appointment Request Form',
    whenToUse: 'Date preference and service for clinics and barbers.',
    sectors: ['clinic', 'barber'],
  },
  {
    id: 'form-reservation',
    family: 'form',
    name: 'Reservation Form',
    whenToUse: 'Party size, date, time for restaurants and hotels.',
    sectors: ['restaurant', 'hotel', 'cafe'],
  },
  {
    id: 'form-intake-legal',
    family: 'form',
    name: 'Legal Intake Form',
    whenToUse: 'Matter type and urgency fields for law firm lead gen.',
    sectors: ['legal'],
  },

  // —— Features (≥3) ——
  {
    id: 'features-three-pillar',
    family: 'features',
    name: 'Three Pillar Features',
    whenToUse: 'Three equal benefit blocks under the hero for clarity.',
    sectors: ['corporate', 'clinic', 'default', '*'],
  },
  {
    id: 'features-alternating-rows',
    family: 'features',
    name: 'Alternating Feature Rows',
    whenToUse: 'Storytelling feature list with image/text flips.',
    sectors: ['corporate', 'hotel', 'architecture', 'default'],
  },
  {
    id: 'features-icon-row',
    family: 'features',
    name: 'Icon Feature Row',
    whenToUse: 'Compact amenity or benefit icons without heavy cards.',
    sectors: ['hotel', 'clinic', 'cafe'],
  },
  {
    id: 'features-numbered-process',
    family: 'features',
    name: 'Numbered Process Features',
    whenToUse: 'Step-by-step how-it-works for services and SaaS.',
    sectors: ['legal', 'clinic', 'corporate', 'architecture'],
  },

  // —— Galleries (≥3) ——
  {
    id: 'gallery-masonry',
    family: 'gallery',
    name: 'Masonry Gallery',
    whenToUse: 'Varied aspect ratios for food, craft, and fashion imagery.',
    sectors: ['restaurant', 'fashion', 'bakery', 'barber'],
  },
  {
    id: 'gallery-project-grid',
    family: 'gallery',
    name: 'Project Grid Gallery',
    whenToUse: 'Even grid of built work or rooms for architecture and hotels.',
    sectors: ['architecture', 'hotel'],
  },
  {
    id: 'gallery-carousel-focus',
    family: 'gallery',
    name: 'Focus Carousel Gallery',
    whenToUse: 'One large image at a time with subtle navigation.',
    sectors: ['fashion', 'hotel', 'clinic', '*'],
  },
  {
    id: 'gallery-before-after',
    family: 'gallery',
    name: 'Before / After Gallery',
    whenToUse: 'Transformation pairs for barbers and clinics.',
    sectors: ['barber', 'clinic'],
  },

  // —— Abouts (≥3) ——
  {
    id: 'about-founder-split',
    family: 'about',
    name: 'Founder Split About',
    whenToUse: 'Portrait + narrative for founder-led local brands.',
    sectors: ['cafe', 'bakery', 'barber', 'restaurant'],
  },
  {
    id: 'about-studio-manifesto',
    family: 'about',
    name: 'Studio Manifesto About',
    whenToUse: 'Beliefs and method for architecture and creative studios.',
    sectors: ['architecture', 'fashion'],
  },
  {
    id: 'about-clinic-credentials',
    family: 'about',
    name: 'Clinic Credentials About',
    whenToUse: 'Team, accreditations, and care philosophy for clinics.',
    sectors: ['clinic'],
  },
  {
    id: 'about-brand-timeline',
    family: 'about',
    name: 'Brand Timeline About',
    whenToUse: 'Milestones narrative for hotels, corporates, and heritage brands.',
    sectors: ['hotel', 'corporate', 'bakery', 'default'],
  },
];

export function componentsByFamily(
  family: ComponentMeta['family'],
): ComponentMeta[] {
  return COMPONENT_LIBRARY.filter((component) => component.family === family);
}

export function getComponentById(id: string): ComponentMeta | undefined {
  return COMPONENT_LIBRARY.find((component) => component.id === id);
}
