export type TemplateCategory = 'gastronomy' | 'services' | 'luxury' | 'corporate' | 'tech';

export interface TemplateItem {
  id: number;
  slug: string;
  categoryKey: TemplateCategory;
  nameEs: string;
  nameEn: string;
  categoryEs: string;
  categoryEn: string;
  descEs: string;
  descEn: string;
  image: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=600&q=80`;

/** Pexels — imágenes gratuitas (licencia Pexels, uso comercial permitido). */
const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop`;

export const templatesCatalog: TemplateItem[] = [
  // ── GASTRONOMÍA (12) ──────────────────────────────────────────
  {
    id: 1, slug: 'vesper', categoryKey: 'gastronomy',
    nameEs: 'Vesper', nameEn: 'Vesper',
    categoryEs: 'Restaurante Gourmet', categoryEn: 'Gourmet Restaurant',
    descEs: 'Elegancia gastronómica para restaurantes de alto nivel, bodegas y experiencias culinarias memorables.',
    descEn: 'Culinary elegance for fine dining, boutique wineries, and memorable food experiences.',
    image: u('1517248135467-4c7edcad34c4'),
  },
  {
    id: 2, slug: 'mokka', categoryKey: 'gastronomy',
    nameEs: 'Mokka', nameEn: 'Mokka',
    categoryEs: 'Cafetería de Especialidad', categoryEn: 'Specialty Coffee',
    descEs: 'Ambiente acogedor para cafeterías boutique, tostaderos y pastelerías artesanales.',
    descEn: 'Warm atmosphere for boutique coffee shops, roasters, and artisan bakeries.',
    image: p(302899),
  },
  {
    id: 3, slug: 'sable', categoryKey: 'gastronomy',
    nameEs: 'Sable', nameEn: 'Sable',
    categoryEs: 'Bistro & Gastronomía', categoryEn: 'Bistro & Gastronomy',
    descEs: 'Calidez y sofisticación para bistros locales, brasseries y experiencias gastronómicas premium.',
    descEn: 'Warm sophistication for local bistros, brasseries, and premium dining.',
    image: u('1559339352-11d035aa65de'),
  },
  {
    id: 4, slug: 'trattoria', categoryKey: 'gastronomy',
    nameEs: 'Trattoria', nameEn: 'Trattoria',
    categoryEs: 'Restaurante Italiano', categoryEn: 'Italian Restaurant',
    descEs: 'Diseño mediterráneo auténtico para trattorias, pizzerías gourmet y cocina italiana de autor.',
    descEn: 'Authentic Mediterranean design for trattorias, gourmet pizzerias, and Italian cuisine.',
    image: u('1513104890138-7c749659a591'),
  },
  {
    id: 5, slug: 'sakura', categoryKey: 'gastronomy',
    nameEs: 'Sakura', nameEn: 'Sakura',
    categoryEs: 'Restaurante Japonés', categoryEn: 'Japanese Restaurant',
    descEs: 'Minimalismo zen para sushi bars, ramen shops y restaurantes de cocina asiática contemporánea.',
    descEn: 'Zen minimalism for sushi bars, ramen shops, and contemporary Asian cuisine.',
    image: p(357756),
  },
  {
    id: 6, slug: 'ember', categoryKey: 'gastronomy',
    nameEs: 'Ember', nameEn: 'Ember',
    categoryEs: 'Parrilla & Asador', categoryEn: 'Grill & Steakhouse',
    descEs: 'Fuerza visual para parrillas, asadores, steakhouses y cocina a la brasa de alto nivel.',
    descEn: 'Bold visuals for grills, steakhouses, and premium charcoal cooking.',
    image: u('1544025162-d76694265947'),
  },
  {
    id: 7, slug: 'levain', categoryKey: 'gastronomy',
    nameEs: 'Levain', nameEn: 'Levain',
    categoryEs: 'Panadería Artesanal', categoryEn: 'Artisan Bakery',
    descEs: 'Diseño cálido para panaderías artesanales, obradores y pastelerías de masa madre.',
    descEn: 'Warm design for artisan bakeries, patisseries, and sourdough specialists.',
    image: u('1509440159596-0249088772ff'),
  },
  {
    id: 8, slug: 'vine', categoryKey: 'gastronomy',
    nameEs: 'Vine', nameEn: 'Vine',
    categoryEs: 'Bar de Vinos', categoryEn: 'Wine Bar',
    descEs: 'Sofisticación enológica para bares de vinos, cavas y experiencias de cata premium.',
    descEn: 'Oenological sophistication for wine bars, cellars, and premium tasting experiences.',
    image: u('1510812431401-41d2bdab2724'),
  },
  {
    id: 9, slug: 'tapas', categoryKey: 'gastronomy',
    nameEs: 'Tapas', nameEn: 'Tapas',
    categoryEs: 'Taberna Española', categoryEn: 'Spanish Tavern',
    descEs: 'Espíritu mediterráneo para tabernas, bares de tapas y cocina tradicional española.',
    descEn: 'Mediterranean spirit for taverns, tapas bars, and traditional Spanish cuisine.',
    image: u('1551218808-94e220e810d1'),
  },
  {
    id: 10, slug: 'street', categoryKey: 'gastronomy',
    nameEs: 'Street', nameEn: 'Street',
    categoryEs: 'Food Truck Gourmet', categoryEn: 'Gourmet Food Truck',
    descEs: 'Dinamismo urbano para food trucks, street food premium y conceptos gastronómicos móviles.',
    descEn: 'Urban dynamism for food trucks, premium street food, and mobile gastronomy.',
    image: u('1565299624946-b28f40a0ae38'),
  },
  {
    id: 11, slug: 'feast', categoryKey: 'gastronomy',
    nameEs: 'Feast', nameEn: 'Feast',
    categoryEs: 'Catering de Eventos', categoryEn: 'Event Catering',
    descEs: 'Presentación impecable para empresas de catering, banquetes y eventos gastronómicos.',
    descEn: 'Impeccable presentation for catering companies, banquets, and food events.',
    image: u('1555244160-30af0e938a9d'),
  },
  {
    id: 12, slug: 'dolce', categoryKey: 'gastronomy',
    nameEs: 'Dolce', nameEn: 'Dolce',
    categoryEs: 'Pastelería Fina', categoryEn: 'Fine Pastry',
    descEs: 'Delicadeza visual para pastelerías finas, chocolaterías y repostería de autor.',
    descEn: 'Visual delicacy for fine pastry shops, chocolatiers, and author confectionery.',
    image: u('1488477181946-6428a0291777'),
  },

  {
    id: 61, slug: 'stanton', categoryKey: 'gastronomy',
    nameEs: 'Stanton', nameEn: 'Stanton',
    categoryEs: 'Blog de Recetas', categoryEn: 'Recipe Blog',
    descEs: 'Estilo Squarespace: hero split, publicaciones en grid, newsletter y tienda de recetas. Ideal para food blogs.',
    descEn: 'Squarespace-style: split hero, post grid, newsletter and recipe shop. Perfect for food blogs.',
    image: p(5938421),
  },

  // ── SERVICIOS (12) ────────────────────────────────────────────
  {
    id: 13, slug: 'classic-cut', categoryKey: 'services',
    nameEs: 'Classic Cut', nameEn: 'Classic Cut',
    categoryEs: 'Barbería Premium', categoryEn: 'Premium Barbershop',
    descEs: 'Estilo retro-moderno para barberías, peluquerías masculinas y grooming de lujo.',
    descEn: 'Retro-modern style for barbershops, men\'s salons, and luxury grooming.',
    image: p(3993449),
  },
  {
    id: 14, slug: 'lumen', categoryKey: 'services',
    nameEs: 'Lumen', nameEn: 'Lumen',
    categoryEs: 'Clínica de Estética', categoryEn: 'Aesthetic Clinic',
    descEs: 'Diseño limpio y profesional para clínicas dentales, spas y centros de bienestar.',
    descEn: 'Clean professional design for dental clinics, spas, and wellness centers.',
    image: u('1540555700478-4be289fbecef'),
  },
  {
    id: 15, slug: 'iron-ink', categoryKey: 'services',
    nameEs: 'Iron & Ink', nameEn: 'Iron & Ink',
    categoryEs: 'Estudio de Tatuajes', categoryEn: 'Tattoo Studio',
    descEs: 'Identidad audaz para estudios de tatuaje, piercing y arte corporal profesional.',
    descEn: 'Bold identity for tattoo studios, piercing shops, and professional body art.',
    image: p(1874644),
  },
  {
    id: 16, slug: 'torque', categoryKey: 'services',
    nameEs: 'Torque', nameEn: 'Torque',
    categoryEs: 'Taller de Motos', categoryEn: 'Motorcycle Workshop',
    descEs: 'Estética industrial para talleres de motos, custom shops y garages especializados.',
    descEn: 'Industrial aesthetic for motorcycle workshops, custom shops, and specialist garages.',
    image: u('1558618666-fcd25c85cd64'),
  },
  {
    id: 17, slug: 'flow', categoryKey: 'services',
    nameEs: 'Flow', nameEn: 'Flow',
    categoryEs: 'Fontanería & Reformas', categoryEn: 'Plumbing & Renovation',
    descEs: 'Confianza y profesionalidad para fontaneros, electricistas y empresas de reformas.',
    descEn: 'Trust and professionalism for plumbers, electricians, and renovation companies.',
    image: u('1504307651254-35680f356dfd'),
  },
  {
    id: 18, slug: 'sparkle', categoryKey: 'services',
    nameEs: 'Sparkle', nameEn: 'Sparkle',
    categoryEs: 'Limpieza Profesional', categoryEn: 'Professional Cleaning',
    descEs: 'Frescura y fiabilidad para empresas de limpieza, mantenimiento y servicios domésticos.',
    descEn: 'Fresh reliability for cleaning companies, maintenance, and domestic services.',
    image: p(4194622),
  },
  {
    id: 19, slug: 'forge', categoryKey: 'services',
    nameEs: 'Forge', nameEn: 'Forge',
    categoryEs: 'Gimnasio & Fitness', categoryEn: 'Gym & Fitness',
    descEs: 'Energía y motivación para gimnasios, crossfit boxes y centros de entrenamiento personal.',
    descEn: 'Energy and motivation for gyms, crossfit boxes, and personal training centers.',
    image: u('1534438327276-14e5300c3a48'),
  },
  {
    id: 20, slug: 'zenith', categoryKey: 'services',
    nameEs: 'Zenith', nameEn: 'Zenith',
    categoryEs: 'Estudio de Yoga', categoryEn: 'Yoga Studio',
    descEs: 'Serenidad y equilibrio para estudios de yoga, pilates y mindfulness.',
    descEn: 'Serenity and balance for yoga studios, pilates, and mindfulness centers.',
    image: p(4056535),
  },
  {
    id: 21, slug: 'paw', categoryKey: 'services',
    nameEs: 'Paw', nameEn: 'Paw',
    categoryEs: 'Peluquería Canina', categoryEn: 'Pet Grooming',
    descEs: 'Calidez y cuidado para peluquerías caninas, veterinarias y tiendas de mascotas.',
    descEn: 'Warm care for pet grooming, veterinary clinics, and pet stores.',
    image: u('1587300003388-59208cc962cb'),
  },
  {
    id: 22, slug: 'pistons', categoryKey: 'services',
    nameEs: 'Pistons', nameEn: 'Pistons',
    categoryEs: 'Taller Mecánico', categoryEn: 'Auto Repair Shop',
    descEs: 'Robustez profesional para talleres mecánicos, chapa y pintura y servicios automotrices.',
    descEn: 'Professional robustness for auto repair shops, bodywork, and automotive services.',
    image: p(4489706),
  },
  {
    id: 23, slug: 'verde', categoryKey: 'services',
    nameEs: 'Verde', nameEn: 'Verde',
    categoryEs: 'Jardinería & Paisajismo', categoryEn: 'Landscaping',
    descEs: 'Naturaleza y diseño para jardineros, paisajistas y viveros especializados.',
    descEn: 'Nature and design for gardeners, landscapers, and specialized nurseries.',
    image: p(1131458),
  },
  {
    id: 24, slug: 'lens', categoryKey: 'services',
    nameEs: 'Lens', nameEn: 'Lens',
    categoryEs: 'Estudio Fotográfico', categoryEn: 'Photography Studio',
    descEs: 'Portfolio visual impactante para fotógrafos, videógrafos y estudios creativos.',
    descEn: 'Striking visual portfolio for photographers, videographers, and creative studios.',
    image: u('1452587925148-ce544e77e70d'),
  },

  // ── LUJO & ESTILO (12) ────────────────────────────────────────
  {
    id: 25, slug: 'atelier', categoryKey: 'luxury',
    nameEs: 'Atelier', nameEn: 'Atelier',
    categoryEs: 'Joyería & Relojería', categoryEn: 'Jewelry & Watches',
    descEs: 'Ultra refinado para joyerías, relojerías y marcas de lujo con detalle exquisito.',
    descEn: 'Ultra-refined for jewelry, watchmakers, and luxury brands with exquisite detail.',
    image: u('1515562141207-7a88fb7ce338'),
  },
  {
    id: 26, slug: 'maison', categoryKey: 'luxury',
    nameEs: 'Maison', nameEn: 'Maison',
    categoryEs: 'Moda Boutique', categoryEn: 'Fashion Boutique',
    descEs: 'Elegancia editorial para boutiques de moda, showrooms y marcas de diseño.',
    descEn: 'Editorial elegance for fashion boutiques, showrooms, and designer brands.',
    image: p(1926769),
  },
  {
    id: 27, slug: 'serene', categoryKey: 'luxury',
    nameEs: 'Serene', nameEn: 'Serene',
    categoryEs: 'Spa de Lujo', categoryEn: 'Luxury Spa',
    descEs: 'Tranquilidad premium para spas de lujo, balnearios y retiros de bienestar.',
    descEn: 'Premium tranquility for luxury spas, thermal baths, and wellness retreats.',
    image: u('1544161515-4ab6ce6db874'),
  },
  {
    id: 28, slug: 'vows', categoryKey: 'luxury',
    nameEs: 'Vows', nameEn: 'Vows',
    categoryEs: 'Wedding Planner', categoryEn: 'Wedding Planner',
    descEs: 'Romance y sofisticación para wedding planners, fincas de bodas y eventos nupciales.',
    descEn: 'Romance and sophistication for wedding planners, venues, and bridal events.',
    image: u('1519741497674-611481863552'),
  },
  {
    id: 29, slug: 'retreat', categoryKey: 'luxury',
    nameEs: 'Retreat', nameEn: 'Retreat',
    categoryEs: 'Hotel Boutique', categoryEn: 'Boutique Hotel',
    descEs: 'Inmersivo y sugerente para hoteles boutique, villas privadas y alojamientos exclusivos.',
    descEn: 'Immersive atmosphere for boutique hotels, private villas, and exclusive lodging.',
    image: p(271624),
  },
  {
    id: 30, slug: 'essence', categoryKey: 'luxury',
    nameEs: 'Essence', nameEn: 'Essence',
    categoryEs: 'Perfumería Niche', categoryEn: 'Niche Perfumery',
    descEs: 'Sensorialidad refinada para perfumerías, marcas de fragancias y cosmética premium.',
    descEn: 'Refined sensoriality for perfumeries, fragrance brands, and premium cosmetics.',
    image: u('1541643600914-78b084683601'),
  },
  {
    id: 31, slug: 'chronicle', categoryKey: 'luxury',
    nameEs: 'Chronicle', nameEn: 'Chronicle',
    categoryEs: 'Galería de Arte', categoryEn: 'Art Gallery',
    descEs: 'Espacio museístico para galerías de arte, coleccionistas y exposiciones contemporáneas.',
    descEn: 'Museum-like space for art galleries, collectors, and contemporary exhibitions.',
    image: u('1531249550759-c3be45408008'),
  },
  {
    id: 32, slug: 'domaine', categoryKey: 'luxury',
    nameEs: 'Domaine', nameEn: 'Domaine',
    categoryEs: 'Bodega Premium', categoryEn: 'Premium Winery',
    descEs: 'Prestigio enológico para bodegas, viñedos y marcas de vino de alta gama.',
    descEn: 'Oenological prestige for wineries, vineyards, and high-end wine brands.',
    image: u('1506377247377-2a5b3b417ebb'),
  },
  {
    id: 33, slug: 'haven', categoryKey: 'luxury',
    nameEs: 'Haven', nameEn: 'Haven',
    categoryEs: 'Interiorismo de Lujo', categoryEn: 'Luxury Interior Design',
    descEs: 'Sofisticación espacial para interioristas, decoradores y diseño de interiores premium.',
    descEn: 'Spatial sophistication for interior designers and premium home styling.',
    image: u('1618221195710-dd6b41faaea6'),
  },
  {
    id: 34, slug: 'yacht', categoryKey: 'luxury',
    nameEs: 'Yacht', nameEn: 'Yacht',
    categoryEs: 'Charter Náutico', categoryEn: 'Yacht Charter',
    descEs: 'Lujo marítimo para charters náuticos, marinas y experiencias en el mar.',
    descEn: 'Maritime luxury for yacht charters, marinas, and sea experiences.',
    image: u('1567899378494-47b22e2d9b4d'),
  },
  {
    id: 35, slug: 'prive', categoryKey: 'luxury',
    nameEs: 'Privé', nameEn: 'Privé',
    categoryEs: 'Club Exclusivo', categoryEn: 'Exclusive Club',
    descEs: 'Exclusividad y discreción para clubs privados, membresías VIP y espacios selectos.',
    descEn: 'Exclusivity and discretion for private clubs, VIP memberships, and select venues.',
    image: u('1564507592337-606612e99698'),
  },
  {
    id: 36, slug: 'minimalist', categoryKey: 'luxury',
    nameEs: 'Minimalist', nameEn: 'Minimalist',
    categoryEs: 'Portfolio Creativo', categoryEn: 'Creative Portfolio',
    descEs: 'Lienzo en blanco para diseñadores, artistas y profesionales creativos independientes.',
    descEn: 'Clean canvas for designers, artists, and independent creative professionals.',
    image: u('1497366216548-37526070297c'),
  },

  // ── CORPORATIVO (12) ──────────────────────────────────────────
  {
    id: 37, slug: 'nexus', categoryKey: 'corporate',
    nameEs: 'Nexus', nameEn: 'Nexus',
    categoryEs: 'Consultoría B2B', categoryEn: 'B2B Consulting',
    descEs: 'Corporativo moderno para consultoras, despachos profesionales y servicios empresariales.',
    descEn: 'Modern corporate for consultancies, professional firms, and business services.',
    image: p(3184292),
  },
  {
    id: 38, slug: 'vanguard', categoryKey: 'corporate',
    nameEs: 'Vanguard', nameEn: 'Vanguard',
    categoryEs: 'Agencia de Marketing', categoryEn: 'Marketing Agency',
    descEs: 'Dinámico y llamativo para agencias de publicidad, comunicación y marketing digital.',
    descEn: 'Dynamic and bold for advertising, communication, and digital marketing agencies.',
    image: u('1460925895917-afdab827c52f'),
  },
  {
    id: 39, slug: 'habitat', categoryKey: 'corporate',
    nameEs: 'Habitat', nameEn: 'Habitat',
    categoryEs: 'Inmobiliaria', categoryEn: 'Real Estate',
    descEs: 'Alta conversión para inmobiliarias, promotoras y gestión de propiedades premium.',
    descEn: 'High conversion for real estate agencies, developers, and premium property management.',
    image: u('1560518883-ce09059eeffa'),
  },
  {
    id: 40, slug: 'lex', categoryKey: 'corporate',
    nameEs: 'Lex', nameEn: 'Lex',
    categoryEs: 'Despacho de Abogados', categoryEn: 'Law Firm',
    descEs: 'Autoridad y confianza para bufetes de abogados, notarías y servicios jurídicos.',
    descEn: 'Authority and trust for law firms, notaries, and legal services.',
    image: p(5668473),
  },
  {
    id: 41, slug: 'ledger', categoryKey: 'corporate',
    nameEs: 'Ledger', nameEn: 'Ledger',
    categoryEs: 'Asesoría Fiscal', categoryEn: 'Tax Advisory',
    descEs: 'Precisión profesional para asesorías fiscales, contables y gestorías empresariales.',
    descEn: 'Professional precision for tax advisory, accounting, and business management.',
    image: u('1554224155-6726b3ff858f'),
  },
  {
    id: 42, slug: 'shield', categoryKey: 'corporate',
    nameEs: 'Shield', nameEn: 'Shield',
    categoryEs: 'Seguros & Correduría', categoryEn: 'Insurance Broker',
    descEs: 'Seguridad y claridad para corredurías de seguros, mutuas y servicios financieros.',
    descEn: 'Security and clarity for insurance brokers, mutuals, and financial services.',
    image: u('1450101499163-c8848c66ca85'),
  },
  {
    id: 43, slug: 'blueprint', categoryKey: 'corporate',
    nameEs: 'Blueprint', nameEn: 'Blueprint',
    categoryEs: 'Estudio de Arquitectura', categoryEn: 'Architecture Studio',
    descEs: 'Visión espacial para estudios de arquitectura, urbanismo y diseño estructural.',
    descEn: 'Spatial vision for architecture studios, urban planning, and structural design.',
    image: u('1487958449943-2429d8bba25f'),
  },
  {
    id: 44, slug: 'pulse', categoryKey: 'corporate',
    nameEs: 'Pulse', nameEn: 'Pulse',
    categoryEs: 'Recursos Humanos', categoryEn: 'Human Resources',
    descEs: 'Cercanía profesional para consultoras de RRHH, selección de talento y coaching ejecutivo.',
    descEn: 'Professional closeness for HR consultancies, talent selection, and executive coaching.',
    image: u('1521737714892-d9d4ea0bb2a2'),
  },
  {
    id: 45, slug: 'learn', categoryKey: 'corporate',
    nameEs: 'Learn', nameEn: 'Learn',
    categoryEs: 'Academia & Formación', categoryEn: 'Academy & Training',
    descEs: 'Inspiración educativa para academias, centros de formación y e-learning corporativo.',
    descEn: 'Educational inspiration for academies, training centers, and corporate e-learning.',
    image: u('1523050854058-8df90110c9f1'),
  },
  {
    id: 46, slug: 'care', categoryKey: 'corporate',
    nameEs: 'Care', nameEn: 'Care',
    categoryEs: 'Clínica Médica', categoryEn: 'Medical Clinic',
    descEs: 'Confianza sanitaria para clínicas médicas, centros de salud y consultas especializadas.',
    descEn: 'Healthcare trust for medical clinics, health centers, and specialized practices.',
    image: u('1629909613654-28e377c37b09'),
  },
  {
    id: 47, slug: 'united', categoryKey: 'corporate',
    nameEs: 'United', nameEn: 'United',
    categoryEs: 'ONG & Fundación', categoryEn: 'NGO & Foundation',
    descEs: 'Impacto social para ONGs, fundaciones y organizaciones sin ánimo de lucro.',
    descEn: 'Social impact for NGOs, foundations, and non-profit organizations.',
    image: u('1559027418-229201bbeb55'),
  },
  {
    id: 48, slug: 'summit', categoryKey: 'corporate',
    nameEs: 'Summit', nameEn: 'Summit',
    categoryEs: 'Ingeniería Industrial', categoryEn: 'Industrial Engineering',
    descEs: 'Solidez técnica para empresas de ingeniería, construcción industrial y manufactura.',
    descEn: 'Technical solidity for engineering firms, industrial construction, and manufacturing.',
    image: u('1504307651254-35680f356dfd'),
  },

  // ── TECNOLOGÍA (12) ───────────────────────────────────────────
  {
    id: 49, slug: 'arc', categoryKey: 'tech',
    nameEs: 'Arc', nameEn: 'Arc',
    categoryEs: 'Startup SaaS', categoryEn: 'SaaS Startup',
    descEs: 'Moderno y convertible para startups SaaS, plataformas digitales y productos tech.',
    descEn: 'Modern and converting for SaaS startups, digital platforms, and tech products.',
    image: u('1460925895917-afdab827c52f'),
  },
  {
    id: 50, slug: 'vault', categoryKey: 'tech',
    nameEs: 'Vault', nameEn: 'Vault',
    categoryEs: 'Fintech', categoryEn: 'Fintech',
    descEs: 'Confianza financiera para fintechs, neobancos y soluciones de pagos digitales.',
    descEn: 'Financial trust for fintechs, neobanks, and digital payment solutions.',
    image: u('1551288049-bebda4e38f71'),
  },
  {
    id: 51, slug: 'neural', categoryKey: 'tech',
    nameEs: 'Neural', nameEn: 'Neural',
    categoryEs: 'IA & Machine Learning', categoryEn: 'AI & Machine Learning',
    descEs: 'Vanguardia tecnológica para empresas de IA, automatización y machine learning.',
    descEn: 'Tech frontier for AI companies, automation, and machine learning.',
    image: u('1677442136019-21780ecad995'),
  },
  {
    id: 52, slug: 'sentinel', categoryKey: 'tech',
    nameEs: 'Sentinel', nameEn: 'Sentinel',
    categoryEs: 'Ciberseguridad', categoryEn: 'Cybersecurity',
    descEs: 'Protección digital para empresas de ciberseguridad, pentesting y seguridad informática.',
    descEn: 'Digital protection for cybersecurity firms, pentesting, and IT security.',
    image: u('1550751827-4bd374c3f58b'),
  },
  {
    id: 53, slug: 'codecraft', categoryKey: 'tech',
    nameEs: 'Codecraft', nameEn: 'Codecraft',
    categoryEs: 'Agencia de Desarrollo', categoryEn: 'Dev Agency',
    descEs: 'Precisión técnica para agencias de desarrollo web, software a medida y consultoría IT.',
    descEn: 'Technical precision for web dev agencies, custom software, and IT consulting.',
    image: u('1498050108023-c5249f4df085'),
  },
  {
    id: 54, slug: 'cloudline', categoryKey: 'tech',
    nameEs: 'Cloudline', nameEn: 'Cloudline',
    categoryEs: 'Infraestructura Cloud', categoryEn: 'Cloud Infrastructure',
    descEs: 'Escalabilidad visual para proveedores cloud, DevOps y servicios de infraestructura.',
    descEn: 'Visual scalability for cloud providers, DevOps, and infrastructure services.',
    image: u('1451187580459-43490279c0fa'),
  },
  {
    id: 62, slug: 'volt', categoryKey: 'tech',
    nameEs: 'Helios', nameEn: 'Helios',
    categoryEs: 'Energías Renovables', categoryEn: 'Renewable Energy',
    descEs: 'Diseño premium para empresas de solar, autoconsumo, baterías y movilidad eléctrica.',
    descEn: 'Premium design for solar, self-consumption, battery and EV companies.',
    image: p(9875446),
  },
  {
    id: 55, slug: 'appify', categoryKey: 'tech',
    nameEs: 'Appify', nameEn: 'Appify',
    categoryEs: 'Desarrollo Móvil', categoryEn: 'Mobile Development',
    descEs: 'Diseño app-first para estudios de apps móviles, UX móvil y productos digitales.',
    descEn: 'App-first design for mobile studios, mobile UX, and digital products.',
    image: u('1512941937669-90a1b58e7e9c'),
  },
  {
    id: 56, slug: 'block', categoryKey: 'tech',
    nameEs: 'Block', nameEn: 'Block',
    categoryEs: 'Web3 & Blockchain', categoryEn: 'Web3 & Blockchain',
    descEs: 'Futurismo digital para proyectos Web3, blockchain y economía descentralizada.',
    descEn: 'Digital futurism for Web3 projects, blockchain, and decentralized economy.',
    image: u('1639765481584-891b7ac91b2a'),
  },
  {
    id: 57, slug: 'playground', categoryKey: 'tech',
    nameEs: 'Playground', nameEn: 'Playground',
    categoryEs: 'Gaming Studio', categoryEn: 'Gaming Studio',
    descEs: 'Energía lúdica para estudios de videojuegos, esports y entretenimiento digital.',
    descEn: 'Playful energy for game studios, esports, and digital entertainment.',
    image: u('1542751371-adc38448a05e'),
  },
  {
    id: 58, slug: 'sensor', categoryKey: 'tech',
    nameEs: 'Sensor', nameEn: 'Sensor',
    categoryEs: 'IoT & Hardware', categoryEn: 'IoT & Hardware',
    descEs: 'Innovación tangible para empresas de IoT, hardware inteligente y dispositivos conectados.',
    descEn: 'Tangible innovation for IoT companies, smart hardware, and connected devices.',
    image: u('1518770660439-4636190af475'),
  },
  {
    id: 59, slug: 'dataflow', categoryKey: 'tech',
    nameEs: 'Dataflow', nameEn: 'Dataflow',
    categoryEs: 'Analytics & Big Data', categoryEn: 'Analytics & Big Data',
    descEs: 'Claridad analítica para empresas de datos, business intelligence y analítica avanzada.',
    descEn: 'Analytical clarity for data companies, business intelligence, and advanced analytics.',
    image: u('1551288049-bebda4e38f71'),
  },
  {
    id: 60, slug: 'launch', categoryKey: 'tech',
    nameEs: 'Launch', nameEn: 'Launch',
    categoryEs: 'Producto Digital', categoryEn: 'Digital Product',
    descEs: 'Lanzamiento impactante para productos digitales, MVPs y plataformas en crecimiento.',
    descEn: 'Impactful launch for digital products, MVPs, and growing platforms.',
    image: u('1551434678-e076c223a692'),
  },
];

/** Orden de trabajo: 6 gastronomía, 12 servicios, 6 lujo, 6 corporativo, 6 tech = 36 totales */
export const TEMPLATE_LIMITS: Record<TemplateCategory, number> = {
  gastronomy: 6,
  services: 12,
  luxury: 6,
  corporate: 6,
  tech: 6,
};

export function getPublishedTemplates(): TemplateItem[] {
  const counts: Partial<Record<TemplateCategory, number>> = {};
  return templatesCatalog
    .filter((t) => {
      const current = counts[t.categoryKey] ?? 0;
      if (current >= TEMPLATE_LIMITS[t.categoryKey]) return false;
      counts[t.categoryKey] = current + 1;
      return true;
    })
    ;
}

export function getTemplateBySlug(slug: string): TemplateItem | undefined {
  return templatesCatalog.find((t) => t.slug === slug)
    ?? getPublishedTemplates().find((t) => t.slug === slug);
}

export const categoryCounts = {
  gastronomy: getPublishedTemplates().filter((t) => t.categoryKey === 'gastronomy').length,
  services: getPublishedTemplates().filter((t) => t.categoryKey === 'services').length,
  luxury: getPublishedTemplates().filter((t) => t.categoryKey === 'luxury').length,
  corporate: getPublishedTemplates().filter((t) => t.categoryKey === 'corporate').length,
  tech: getPublishedTemplates().filter((t) => t.categoryKey === 'tech').length,
};
