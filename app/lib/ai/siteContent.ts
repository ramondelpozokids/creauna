export interface ServiceItem {
  title: string;
  desc: string;
}

type ContentPreset = { es: ServiceItem[]; en: ServiceItem[]; taglineEs: string; taglineEn: string; ctaPrimaryEs: string; ctaPrimaryEn: string; ctaSecondaryEs: string; ctaSecondaryEn: string };

export type { ContentPreset };

const CONTENT_PRESETS: Record<string, ContentPreset> = {
  trattoria: {
    taglineEs: 'Auténtica cocina italiana con ingredientes frescos y recetas de la nonna.',
    taglineEn: 'Authentic Italian cuisine with fresh ingredients and nonna\'s recipes.',
    ctaPrimaryEs: 'Ver carta', ctaPrimaryEn: 'View menu',
    ctaSecondaryEs: 'Reservar mesa', ctaSecondaryEn: 'Book a table',
    es: [
      { title: 'Pasta artesanal', desc: 'Platos elaborados con masa fresca y salsas caseras cada día.' },
      { title: 'Vinos italianos', desc: 'Selección curada de bodegas de Toscana, Piamonte y Sicilia.' },
      { title: 'Eventos privados', desc: 'Celebraciones íntimas con menú degustación a medida.' },
    ],
    en: [
      { title: 'Artisan pasta', desc: 'Dishes made with fresh pasta and homemade sauces daily.' },
      { title: 'Italian wines', desc: 'Curated selection from Tuscany, Piedmont, and Sicily.' },
      { title: 'Private events', desc: 'Intimate celebrations with bespoke tasting menus.' },
    ],
  },
  vesper: {
    taglineEs: 'Alta cocina con producto de temporada y una experiencia gastronómica inolvidable.',
    taglineEn: 'Fine dining with seasonal produce and an unforgettable culinary experience.',
    ctaPrimaryEs: 'Ver menú degustación', ctaPrimaryEn: 'View tasting menu',
    ctaSecondaryEs: 'Reservar', ctaSecondaryEn: 'Reserve',
    es: [
      { title: 'Menú degustación', desc: 'Secuencia de platos de autor con maridaje opcional.' },
      { title: 'Carta de vinos', desc: 'Bodega con referencias nacionales e internacionales.' },
      { title: 'Chef\'s table', desc: 'Experiencia exclusiva en la cocina con el chef.' },
    ],
    en: [
      { title: 'Tasting menu', desc: 'Author\'s course sequence with optional wine pairing.' },
      { title: 'Wine list', desc: 'Cellar with national and international selections.' },
      { title: 'Chef\'s table', desc: 'Exclusive kitchen experience with the chef.' },
    ],
  },
  mokka: {
    taglineEs: 'Café de especialidad tostado artesanalmente en un ambiente acogedor.',
    taglineEn: 'Specialty coffee artisan-roasted in a warm, welcoming atmosphere.',
    ctaPrimaryEs: 'Ver carta', ctaPrimaryEn: 'View menu',
    ctaSecondaryEs: 'Visítanos', ctaSecondaryEn: 'Visit us',
    es: [
      { title: 'Café de origen', desc: 'Granos seleccionados y tostados semanalmente en nuestro obrador.' },
      { title: 'Pastelería artesanal', desc: 'Bollería y repostería horneada cada mañana.' },
      { title: 'Espacio coworking', desc: 'Zona tranquila con WiFi y enchufes para trabajar.' },
    ],
    en: [
      { title: 'Single-origin coffee', desc: 'Selected beans roasted weekly in our roastery.' },
      { title: 'Artisan bakery', desc: 'Pastries and baked goods made fresh every morning.' },
      { title: 'Coworking space', desc: 'Quiet area with WiFi and power outlets.' },
    ],
  },
  pistons: {
    taglineEs: 'Taller mecánico de confianza con diagnóstico preciso y servicio rápido.',
    taglineEn: 'Trusted auto repair shop with accurate diagnostics and fast service.',
    ctaPrimaryEs: 'Solicitar presupuesto', ctaPrimaryEn: 'Get a quote',
    ctaSecondaryEs: 'Pedir cita', ctaSecondaryEn: 'Book appointment',
    es: [
      { title: 'Mecánica general', desc: 'Revisión, mantenimiento y reparación de motor y transmisión.' },
      { title: 'Diagnóstico electrónico', desc: 'Equipamiento de última generación para detectar averías.' },
      { title: 'Neumáticos y frenos', desc: 'Cambio, alineación y revisión completa del sistema de frenado.' },
    ],
    en: [
      { title: 'General mechanics', desc: 'Engine and transmission inspection, maintenance, and repair.' },
      { title: 'Electronic diagnostics', desc: 'Latest equipment to detect faults accurately.' },
      { title: 'Tires & brakes', desc: 'Replacement, alignment, and full brake system check.' },
    ],
  },
  'classic-cut': {
    taglineEs: 'Barbería premium donde el estilo clásico se encuentra con la técnica moderna.',
    taglineEn: 'Premium barbershop where classic style meets modern technique.',
    ctaPrimaryEs: 'Reservar cita', ctaPrimaryEn: 'Book appointment',
    ctaSecondaryEs: 'Ver servicios', ctaSecondaryEn: 'View services',
    es: [
      { title: 'Corte clásico', desc: 'Cortes a medida con acabado impecable y atención al detalle.' },
      { title: 'Afeitado tradicional', desc: 'Experiencia con toalla caliente, navaja y productos premium.' },
      { title: 'Tratamiento barba', desc: 'Perfilado, hidratación y cuidado completo de la barba.' },
    ],
    en: [
      { title: 'Classic cut', desc: 'Tailored cuts with impeccable finish and attention to detail.' },
      { title: 'Traditional shave', desc: 'Hot towel experience with straight razor and premium products.' },
      { title: 'Beard treatment', desc: 'Shaping, hydration, and complete beard care.' },
    ],
  },
  retreat: {
    taglineEs: 'Hotel boutique con habitaciones exclusivas y una experiencia de hospedaje única.',
    taglineEn: 'Boutique hotel with exclusive rooms and a unique stay experience.',
    ctaPrimaryEs: 'Ver habitaciones', ctaPrimaryEn: 'View rooms',
    ctaSecondaryEs: 'Reservar ahora', ctaSecondaryEn: 'Book now',
    es: [
      { title: 'Habitaciones premium', desc: 'Suites decoradas con diseño contemporáneo y confort absoluto.' },
      { title: 'Desayuno gourmet', desc: 'Productos locales servidos en nuestra terraza con vistas.' },
      { title: 'Experiencias locales', desc: 'Rutas, catas y actividades exclusivas para huéspedes.' },
    ],
    en: [
      { title: 'Premium rooms', desc: 'Suites with contemporary design and absolute comfort.' },
      { title: 'Gourmet breakfast', desc: 'Local products served on our terrace with views.' },
      { title: 'Local experiences', desc: 'Exclusive routes, tastings, and activities for guests.' },
    ],
  },
  sable: {
    taglineEs: 'Bistro de barrio con cocina de mercado, ambiente acogedor y carta de temporada.',
    taglineEn: 'Neighborhood bistro with market cuisine, cozy atmosphere, and seasonal menu.',
    ctaPrimaryEs: 'Ver carta', ctaPrimaryEn: 'View menu',
    ctaSecondaryEs: 'Reservar mesa', ctaSecondaryEn: 'Book a table',
    es: [
      { title: 'Cocina de mercado', desc: 'Platos elaborados con producto fresco de proximidad cada día.' },
      { title: 'Brunch de fin de semana', desc: 'Propuesta especial con dulces, salados y bebidas artesanales.' },
      { title: 'Carta de vinos', desc: 'Selección accesible de tintos, blancos y espumosos nacionales.' },
    ],
    en: [
      { title: 'Market cuisine', desc: 'Dishes made with fresh local produce every day.' },
      { title: 'Weekend brunch', desc: 'Special offering with sweet, savory, and artisan drinks.' },
      { title: 'Wine list', desc: 'Accessible selection of national reds, whites, and sparkling wines.' },
    ],
  },
  stanton: {
    taglineEs: 'Comida casera para la vida moderna — recetas sencillas que cualquiera puede hacer.',
    taglineEn: 'Home cooking for modern life — simple recipes anyone can make.',
    ctaPrimaryEs: 'Ver recetas', ctaPrimaryEn: 'View recipes',
    ctaSecondaryEs: 'Suscribirse', ctaSecondaryEn: 'Subscribe',
    es: [
      { title: 'Recetas rápidas', desc: 'Platos listos en menos de 30 minutos con ingredientes de supermercado.' },
      { title: 'Cocina de temporada', desc: 'Propuestas frescas según el mes y productos locales.' },
      { title: 'Newsletter semanal', desc: 'Novedades, menús y consejos directos a tu correo.' },
    ],
    en: [
      { title: 'Quick recipes', desc: 'Dishes ready in under 30 minutes with supermarket ingredients.' },
      { title: 'Seasonal cooking', desc: 'Fresh ideas based on the month and local produce.' },
      { title: 'Weekly newsletter', desc: 'Updates, menus and tips straight to your inbox.' },
    ],
  },
  sakura: {
    taglineEs: 'Cocina japonesa auténtica con pescado de primera calidad y ambiente zen.',
    taglineEn: 'Authentic Japanese cuisine with top-quality fish and a zen atmosphere.',
    ctaPrimaryEs: 'Ver carta', ctaPrimaryEn: 'View menu',
    ctaSecondaryEs: 'Reservar', ctaSecondaryEn: 'Reserve',
    es: [
      { title: 'Sushi & sashimi', desc: 'Piezas elaboradas al momento con pescado seleccionado diariamente.' },
      { title: 'Ramen artesanal', desc: 'Caldo cocinado durante horas con noodles frescos y toppings premium.' },
      { title: 'Menú omakase', desc: 'Experiencia guiada por el chef con platos de temporada.' },
    ],
    en: [
      { title: 'Sushi & sashimi', desc: 'Pieces made to order with fish selected daily.' },
      { title: 'Artisan ramen', desc: 'Broth simmered for hours with fresh noodles and premium toppings.' },
      { title: 'Omakase menu', desc: 'Chef-guided experience with seasonal dishes.' },
    ],
  },
  ember: {
    taglineEs: 'Carnes a la brasa y parrilla con producto selecto y técnicas de asado tradicionales.',
    taglineEn: 'Charcoal-grilled meats with select cuts and traditional grilling techniques.',
    ctaPrimaryEs: 'Ver carta', ctaPrimaryEn: 'View menu',
    ctaSecondaryEs: 'Reservar mesa', ctaSecondaryEn: 'Book a table',
    es: [
      { title: 'Cortes premium', desc: 'Entrecot, tomahawk y chuletón madurados y asados a la brasa.' },
      { title: 'Parrillada para compartir', desc: 'Selección de carnes y verduras para grupos y celebraciones.' },
      { title: 'Guarniciones de autor', desc: 'Acompañamientos elaborados que realzan cada corte.' },
    ],
    en: [
      { title: 'Premium cuts', desc: 'Ribeye, tomahawk, and dry-aged steaks grilled over charcoal.' },
      { title: 'Sharing grill platter', desc: 'Selection of meats and vegetables for groups and celebrations.' },
      { title: 'Signature sides', desc: 'Crafted accompaniments that elevate every cut.' },
    ],
  },
  lumen: {
    taglineEs: 'Clínica de estética y bienestar con tratamientos avanzados y resultados visibles.',
    taglineEn: 'Aesthetic and wellness clinic with advanced treatments and visible results.',
    ctaPrimaryEs: 'Ver tratamientos', ctaPrimaryEn: 'View treatments',
    ctaSecondaryEs: 'Pedir cita', ctaSecondaryEn: 'Book appointment',
    es: [
      { title: 'Medicina estética', desc: 'Tratamientos faciales y corporales con tecnología de última generación.' },
      { title: 'Dermatología', desc: 'Diagnóstico y cuidado personalizado para todo tipo de piel.' },
      { title: 'Bienestar integral', desc: 'Programas de nutrición, relajación y cuidado preventivo.' },
    ],
    en: [
      { title: 'Aesthetic medicine', desc: 'Facial and body treatments with latest-generation technology.' },
      { title: 'Dermatology', desc: 'Diagnosis and personalized care for all skin types.' },
      { title: 'Holistic wellness', desc: 'Nutrition, relaxation, and preventive care programs.' },
    ],
  },
  'iron-ink': {
    taglineEs: 'Estudio de tatuajes profesional con artistas especializados y diseños únicos.',
    taglineEn: 'Professional tattoo studio with specialized artists and unique designs.',
    ctaPrimaryEs: 'Ver portfolio', ctaPrimaryEn: 'View portfolio',
    ctaSecondaryEs: 'Pedir cita', ctaSecondaryEn: 'Book appointment',
    es: [
      { title: 'Tatuajes a medida', desc: 'Diseños personalizados desde el boceto hasta la ejecución final.' },
      { title: 'Cover-up & retoques', desc: 'Transformación de tatuajes antiguos y mantenimiento profesional.' },
      { title: 'Piercing seguro', desc: 'Procedimiento estéril con joyería de calidad certificada.' },
    ],
    en: [
      { title: 'Custom tattoos', desc: 'Personalized designs from sketch to final execution.' },
      { title: 'Cover-ups & touch-ups', desc: 'Transformation of old tattoos and professional maintenance.' },
      { title: 'Safe piercing', desc: 'Sterile procedure with certified quality jewelry.' },
    ],
  },
  torque: {
    taglineEs: 'Taller de motos especializado en mantenimiento, customización y preparación.',
    taglineEn: 'Motorcycle workshop specialized in maintenance, customization, and tuning.',
    ctaPrimaryEs: 'Solicitar presupuesto', ctaPrimaryEn: 'Get a quote',
    ctaSecondaryEs: 'Pedir cita', ctaSecondaryEn: 'Book appointment',
    es: [
      { title: 'Mantenimiento', desc: 'Revisiones, cambios de aceite y puesta a punto completa.' },
      { title: 'Custom & estética', desc: 'Modificaciones, pintura y personalización de chasis y carrocería.' },
      { title: 'Preparación motor', desc: 'Optimización de rendimiento para carretera y circuito.' },
    ],
    en: [
      { title: 'Maintenance', desc: 'Inspections, oil changes, and full tune-ups.' },
      { title: 'Custom & styling', desc: 'Modifications, paint, and chassis and body customization.' },
      { title: 'Engine tuning', desc: 'Performance optimization for road and track.' },
    ],
  },
  flow: {
    taglineEs: 'Fontanería y reformas integrales con acabados de calidad y plazos garantizados.',
    taglineEn: 'Plumbing and full renovations with quality finishes and guaranteed timelines.',
    ctaPrimaryEs: 'Solicitar presupuesto', ctaPrimaryEn: 'Get a quote',
    ctaSecondaryEs: 'Contactar', ctaSecondaryEn: 'Contact',
    es: [
      { title: 'Fontanería', desc: 'Instalación, reparación y detección de fugas con respuesta urgente.' },
      { title: 'Reformas de baño', desc: 'Diseño, alicatado y equipamiento completo llave en mano.' },
      { title: 'Instalaciones eléctricas', desc: 'Cuadros, cableado y certificaciones con normativa vigente.' },
    ],
    en: [
      { title: 'Plumbing', desc: 'Installation, repair, and leak detection with emergency response.' },
      { title: 'Bathroom renovations', desc: 'Design, tiling, and full turnkey equipment.' },
      { title: 'Electrical installations', desc: 'Panels, wiring, and certifications to current standards.' },
    ],
  },
  sparkle: {
    taglineEs: 'Servicio de limpieza profesional para hogares, oficinas y comunidades.',
    taglineEn: 'Professional cleaning service for homes, offices, and communities.',
    ctaPrimaryEs: 'Solicitar presupuesto', ctaPrimaryEn: 'Get a quote',
    ctaSecondaryEs: 'Contactar', ctaSecondaryEn: 'Contact',
    es: [
      { title: 'Limpieza doméstica', desc: 'Servicio regular o puntual con productos ecológicos certificados.' },
      { title: 'Limpieza de oficinas', desc: 'Mantenimiento diario o semanal adaptado a tu horario laboral.' },
      { title: 'Limpieza profunda', desc: 'Tratamiento intensivo post-obra, mudanza o evento especial.' },
    ],
    en: [
      { title: 'Home cleaning', desc: 'Regular or one-off service with certified eco-friendly products.' },
      { title: 'Office cleaning', desc: 'Daily or weekly maintenance adapted to your work schedule.' },
      { title: 'Deep cleaning', desc: 'Intensive treatment post-construction, move, or special event.' },
    ],
  },
  forge: {
    taglineEs: 'Gimnasio con equipamiento de última generación y entrenadores certificados.',
    taglineEn: 'Gym with state-of-the-art equipment and certified trainers.',
    ctaPrimaryEs: 'Ver planes', ctaPrimaryEn: 'View plans',
    ctaSecondaryEs: 'Prueba gratis', ctaSecondaryEn: 'Free trial',
    es: [
      { title: 'Entrenamiento personal', desc: 'Planes individualizados con seguimiento y objetivos medibles.' },
      { title: 'Clases dirigidas', desc: 'HIIT, spinning, funcional y fuerza en grupo con monitor.' },
      { title: 'Zona de musculación', desc: 'Maquinaria libre y guiada para todos los niveles.' },
    ],
    en: [
      { title: 'Personal training', desc: 'Individualized plans with tracking and measurable goals.' },
      { title: 'Group classes', desc: 'HIIT, spinning, functional, and strength with instructor.' },
      { title: 'Weight training zone', desc: 'Free and guided equipment for all levels.' },
    ],
  },
  zenith: {
    taglineEs: 'Estudio de yoga y mindfulness para reconectar cuerpo, mente y respiración.',
    taglineEn: 'Yoga and mindfulness studio to reconnect body, mind, and breath.',
    ctaPrimaryEs: 'Ver horarios', ctaPrimaryEn: 'View schedule',
    ctaSecondaryEs: 'Reservar clase', ctaSecondaryEn: 'Book a class',
    es: [
      { title: 'Yoga Vinyasa', desc: 'Secuencias dinámicas que enlazan movimiento y respiración consciente.' },
      { title: 'Pilates & movilidad', desc: 'Fortalecimiento del core y trabajo de flexibilidad progresiva.' },
      { title: 'Meditación guiada', desc: 'Sesiones de calma mental y reducción de estrés para todos los niveles.' },
    ],
    en: [
      { title: 'Vinyasa yoga', desc: 'Dynamic sequences linking movement and conscious breathing.' },
      { title: 'Pilates & mobility', desc: 'Core strengthening and progressive flexibility work.' },
      { title: 'Guided meditation', desc: 'Sessions for mental calm and stress reduction for all levels.' },
    ],
  },
  paw: {
    taglineEs: 'Peluquería y cuidado canino con trato cariñoso y productos hipoalergénicos.',
    taglineEn: 'Dog grooming and care with loving treatment and hypoallergenic products.',
    ctaPrimaryEs: 'Reservar cita', ctaPrimaryEn: 'Book appointment',
    ctaSecondaryEs: 'Ver servicios', ctaSecondaryEn: 'View services',
    es: [
      { title: 'Baño y corte', desc: 'Lavado, secado y corte según raza con técnicas suaves y seguras.' },
      { title: 'Cuidado de uñas y oídos', desc: 'Higiene completa para la salud y comodidad de tu mascota.' },
      { title: 'Spa canino', desc: 'Tratamientos relajantes con champús específicos y aromaterapia.' },
    ],
    en: [
      { title: 'Bath & trim', desc: 'Wash, dry, and breed-specific cut with gentle, safe techniques.' },
      { title: 'Nail & ear care', desc: 'Complete hygiene for your pet\'s health and comfort.' },
      { title: 'Dog spa', desc: 'Relaxing treatments with specific shampoos and aromatherapy.' },
    ],
  },
  verde: {
    taglineEs: 'Jardinería y paisajismo que transforma espacios exteriores en oasis naturales.',
    taglineEn: 'Landscaping and gardening that transforms outdoor spaces into natural oases.',
    ctaPrimaryEs: 'Solicitar presupuesto', ctaPrimaryEn: 'Get a quote',
    ctaSecondaryEs: 'Ver proyectos', ctaSecondaryEn: 'View projects',
    es: [
      { title: 'Diseño de jardines', desc: 'Planificación personalizada con plantas adaptadas al clima local.' },
      { title: 'Mantenimiento', desc: 'Poda, riego, fertilización y cuidado periódico de tu jardín.' },
      { title: 'Instalación de césped', desc: 'Siembra, tepes y sistemas de riego automático eficientes.' },
    ],
    en: [
      { title: 'Garden design', desc: 'Personalized planning with plants adapted to local climate.' },
      { title: 'Maintenance', desc: 'Pruning, watering, fertilizing, and periodic garden care.' },
      { title: 'Lawn installation', desc: 'Seeding, sod, and efficient automatic irrigation systems.' },
    ],
  },
  lens: {
    taglineEs: 'Estudio fotográfico y audiovisual para capturar momentos con estilo y profesionalidad.',
    taglineEn: 'Photography and audiovisual studio to capture moments with style and professionalism.',
    ctaPrimaryEs: 'Ver portfolio', ctaPrimaryEn: 'View portfolio',
    ctaSecondaryEs: 'Pedir presupuesto', ctaSecondaryEn: 'Get a quote',
    es: [
      { title: 'Retratos & moda', desc: 'Sesiones en estudio o exterior con dirección artística y retoque incluido.' },
      { title: 'Bodas & eventos', desc: 'Cobertura completa con álbum digital y entrega en plazo acordado.' },
      { title: 'Vídeo corporativo', desc: 'Producción audiovisual para marcas, productos y redes sociales.' },
    ],
    en: [
      { title: 'Portraits & fashion', desc: 'Studio or outdoor sessions with art direction and retouching included.' },
      { title: 'Weddings & events', desc: 'Full coverage with digital album and agreed delivery timeline.' },
      { title: 'Corporate video', desc: 'Audiovisual production for brands, products, and social media.' },
    ],
  },
  atelier: {
    taglineEs: 'Joyería y relojería de autor con piezas exclusivas y acabados exquisitos.',
    taglineEn: 'Author jewelry and watchmaking with exclusive pieces and exquisite finishes.',
    ctaPrimaryEs: 'Ver colección', ctaPrimaryEn: 'View collection',
    ctaSecondaryEs: 'Pedir cita', ctaSecondaryEn: 'Book appointment',
    es: [
      { title: 'Joyería fina', desc: 'Anillos, collares y pulseras con oro, plata y piedras preciosas.' },
      { title: 'Relojes de lujo', desc: 'Selección curada de marcas suizas y relojes de edición limitada.' },
      { title: 'Diseño a medida', desc: 'Creación de piezas únicas según tu estilo y ocasión especial.' },
    ],
    en: [
      { title: 'Fine jewelry', desc: 'Rings, necklaces, and bracelets in gold, silver, and precious stones.' },
      { title: 'Luxury watches', desc: 'Curated selection of Swiss brands and limited edition timepieces.' },
      { title: 'Bespoke design', desc: 'Creation of unique pieces for your style and special occasion.' },
    ],
  },
  maison: {
    taglineEs: 'Boutique de moda con piezas seleccionadas y asesoramiento de estilo personal.',
    taglineEn: 'Fashion boutique with curated pieces and personal style advice.',
    ctaPrimaryEs: 'Ver colección', ctaPrimaryEn: 'View collection',
    ctaSecondaryEs: 'Visítanos', ctaSecondaryEn: 'Visit us',
    es: [
      { title: 'Pret-a-porter', desc: 'Colecciones de temporada de diseñadores nacionales e internacionales.' },
      { title: 'Accesorios', desc: 'Bolsos, cinturones y complementos que completan tu look.' },
      { title: 'Personal shopper', desc: 'Asesoramiento individual para encontrar tu estilo ideal.' },
    ],
    en: [
      { title: 'Ready-to-wear', desc: 'Seasonal collections from national and international designers.' },
      { title: 'Accessories', desc: 'Bags, belts, and complements to complete your look.' },
      { title: 'Personal shopper', desc: 'Individual advice to find your ideal style.' },
    ],
  },
  serene: {
    taglineEs: 'Spa de lujo con rituales de bienestar, tratamientos exclusivos y ambiente de calma.',
    taglineEn: 'Luxury spa with wellness rituals, exclusive treatments, and a calm atmosphere.',
    ctaPrimaryEs: 'Ver tratamientos', ctaPrimaryEn: 'View treatments',
    ctaSecondaryEs: 'Reservar', ctaSecondaryEn: 'Book',
    es: [
      { title: 'Masajes terapéuticos', desc: 'Técnicas sueca, deep tissue y piedras calientes con aceites naturales.' },
      { title: 'Faciales premium', desc: 'Tratamientos anti-edad y hidratación profunda con cosmética de lujo.' },
      { title: 'Circuito de aguas', desc: 'Sauna, baño turco y piscina de hidroterapia para relajación total.' },
    ],
    en: [
      { title: 'Therapeutic massages', desc: 'Swedish, deep tissue, and hot stone techniques with natural oils.' },
      { title: 'Premium facials', desc: 'Anti-aging and deep hydration treatments with luxury cosmetics.' },
      { title: 'Water circuit', desc: 'Sauna, hammam, and hydrotherapy pool for total relaxation.' },
    ],
  },
  vows: {
    taglineEs: 'Organización de bodas y eventos con cada detalle cuidado para un día inolvidable.',
    taglineEn: 'Wedding and event planning with every detail cared for an unforgettable day.',
    ctaPrimaryEs: 'Ver portfolio', ctaPrimaryEn: 'View portfolio',
    ctaSecondaryEs: 'Consulta gratuita', ctaSecondaryEn: 'Free consultation',
    es: [
      { title: 'Planificación integral', desc: 'Coordinación de proveedores, cronograma y presupuesto personalizado.' },
      { title: 'Decoración & floristería', desc: 'Diseño floral y ambientación acorde al estilo de tu celebración.' },
      { title: 'Día B sin estrés', desc: 'Presencia en el evento para que disfrutes cada momento sin preocupaciones.' },
    ],
    en: [
      { title: 'Full planning', desc: 'Vendor coordination, timeline, and personalized budget.' },
      { title: 'Decor & floristry', desc: 'Floral design and ambiance matching your celebration style.' },
      { title: 'Stress-free wedding day', desc: 'On-site presence so you enjoy every moment worry-free.' },
    ],
  },
  essence: {
    taglineEs: 'Perfumería niche con fragancias exclusivas y asesoramiento olfativo personalizado.',
    taglineEn: 'Niche perfumery with exclusive fragrances and personalized olfactory advice.',
    ctaPrimaryEs: 'Ver fragancias', ctaPrimaryEn: 'View fragrances',
    ctaSecondaryEs: 'Visítanos', ctaSecondaryEn: 'Visit us',
    es: [
      { title: 'Fragancias de autor', desc: 'Selección de perfumes artesanales y ediciones limitadas internacionales.' },
      { title: 'Descubrimiento olfativo', desc: 'Sesión personalizada para encontrar tu aroma ideal.' },
      { title: 'Regalos exclusivos', desc: 'Estuches premium y personalización para ocasiones especiales.' },
    ],
    en: [
      { title: 'Author fragrances', desc: 'Selection of artisan perfumes and international limited editions.' },
      { title: 'Olfactory discovery', desc: 'Personalized session to find your ideal scent.' },
      { title: 'Exclusive gifts', desc: 'Premium sets and personalization for special occasions.' },
    ],
  },
  nexus: {
    taglineEs: 'Consultoría estratégica B2B para impulsar el crecimiento y la eficiencia de tu empresa.',
    taglineEn: 'B2B strategic consulting to drive growth and efficiency for your company.',
    ctaPrimaryEs: 'Nuestros servicios', ctaPrimaryEn: 'Our services',
    ctaSecondaryEs: 'Agendar reunión', ctaSecondaryEn: 'Schedule meeting',
    es: [
      { title: 'Estrategia empresarial', desc: 'Análisis de mercado, posicionamiento y plan de crecimiento a medida.' },
      { title: 'Transformación digital', desc: 'Optimización de procesos, herramientas y cultura organizacional.' },
      { title: 'Formación directiva', desc: 'Programas de liderazgo y gestión del cambio para equipos directivos.' },
    ],
    en: [
      { title: 'Business strategy', desc: 'Market analysis, positioning, and tailored growth plan.' },
      { title: 'Digital transformation', desc: 'Process optimization, tools, and organizational culture.' },
      { title: 'Executive training', desc: 'Leadership and change management programs for executive teams.' },
    ],
  },
  vanguard: {
    taglineEs: 'Agencia de marketing digital que convierte ideas en campañas con resultados medibles.',
    taglineEn: 'Digital marketing agency that turns ideas into campaigns with measurable results.',
    ctaPrimaryEs: 'Ver casos de éxito', ctaPrimaryEn: 'View case studies',
    ctaSecondaryEs: 'Solicitar propuesta', ctaSecondaryEn: 'Request proposal',
    es: [
      { title: 'Branding & identidad', desc: 'Naming, logotipo y manual de marca para posicionarte con fuerza.' },
      { title: 'Social media', desc: 'Gestión de redes, contenido y publicidad con ROI demostrable.' },
      { title: 'SEO & publicidad', desc: 'Posicionamiento orgánico y campañas de pago optimizadas.' },
    ],
    en: [
      { title: 'Branding & identity', desc: 'Naming, logo, and brand guidelines for strong positioning.' },
      { title: 'Social media', desc: 'Network management, content, and advertising with proven ROI.' },
      { title: 'SEO & advertising', desc: 'Organic positioning and optimized paid campaigns.' },
    ],
  },
  habitat: {
    taglineEs: 'Inmobiliaria de confianza para comprar, vender o alquilar con asesoramiento experto.',
    taglineEn: 'Trusted real estate agency to buy, sell, or rent with expert advice.',
    ctaPrimaryEs: 'Ver propiedades', ctaPrimaryEn: 'View properties',
    ctaSecondaryEs: 'Contactar', ctaSecondaryEn: 'Contact',
    es: [
      { title: 'Compra & venta', desc: 'Valoración profesional, negociación y gestión documental completa.' },
      { title: 'Alquiler', desc: 'Selección de inquilinos, contratos y seguimiento durante toda la estancia.' },
      { title: 'Inversión', desc: 'Análisis de rentabilidad y oportunidades en el mercado inmobiliario.' },
    ],
    en: [
      { title: 'Buy & sell', desc: 'Professional valuation, negotiation, and full documentation management.' },
      { title: 'Rental', desc: 'Tenant selection, contracts, and follow-up throughout the stay.' },
      { title: 'Investment', desc: 'Profitability analysis and opportunities in the real estate market.' },
    ],
  },
  lex: {
    taglineEs: 'Despacho de abogados con experiencia en derecho civil, mercantil y laboral.',
    taglineEn: 'Law firm with experience in civil, commercial, and labor law.',
    ctaPrimaryEs: 'Nuestros servicios', ctaPrimaryEn: 'Our services',
    ctaSecondaryEs: 'Consulta inicial', ctaSecondaryEn: 'Initial consultation',
    es: [
      { title: 'Derecho mercantil', desc: 'Constitución de empresas, contratos y resolución de conflictos comerciales.' },
      { title: 'Derecho laboral', desc: 'Asesoramiento a empresas y trabajadores en despidos, ERE y negociación.' },
      { title: 'Derecho civil', desc: 'Herencias, divorcios, propiedad y reclamaciones con seguimiento personalizado.' },
    ],
    en: [
      { title: 'Commercial law', desc: 'Company formation, contracts, and commercial dispute resolution.' },
      { title: 'Labor law', desc: 'Advice for companies and workers on dismissals, layoffs, and negotiation.' },
      { title: 'Civil law', desc: 'Inheritance, divorce, property, and claims with personalized follow-up.' },
    ],
  },
  ledger: {
    taglineEs: 'Asesoría fiscal y contable para autónomos, pymes y empresas en crecimiento.',
    taglineEn: 'Tax and accounting advisory for freelancers, SMEs, and growing companies.',
    ctaPrimaryEs: 'Nuestros servicios', ctaPrimaryEn: 'Our services',
    ctaSecondaryEs: 'Consulta gratuita', ctaSecondaryEn: 'Free consultation',
    es: [
      { title: 'Contabilidad', desc: 'Llevamiento de libros, balances y cuentas anuales al día.' },
      { title: 'Fiscalidad', desc: 'Declaraciones trimestrales, IRPF, IVA y optimización tributaria legal.' },
      { title: 'Consultoría financiera', desc: 'Análisis de viabilidad, presupuestos y planificación estratégica.' },
    ],
    en: [
      { title: 'Accounting', desc: 'Bookkeeping, balance sheets, and up-to-date annual accounts.' },
      { title: 'Taxation', desc: 'Quarterly filings, income tax, VAT, and legal tax optimization.' },
      { title: 'Financial consulting', desc: 'Feasibility analysis, budgets, and strategic planning.' },
    ],
  },
  shield: {
    taglineEs: 'Correduría de seguros que protege lo que más importa con las mejores coberturas.',
    taglineEn: 'Insurance brokerage that protects what matters most with the best coverage.',
    ctaPrimaryEs: 'Ver seguros', ctaPrimaryEn: 'View insurance',
    ctaSecondaryEs: 'Pedir presupuesto', ctaSecondaryEn: 'Get a quote',
    es: [
      { title: 'Seguros de hogar', desc: 'Protección integral para vivienda, contenido y responsabilidad civil.' },
      { title: 'Seguros de auto', desc: 'Cobertura a todo riesgo, terceros y asistencia en carretera 24h.' },
      { title: 'Seguros de vida', desc: 'Planificación familiar y protección financiera a largo plazo.' },
    ],
    en: [
      { title: 'Home insurance', desc: 'Comprehensive protection for property, contents, and liability.' },
      { title: 'Auto insurance', desc: 'Full coverage, third party, and 24h roadside assistance.' },
      { title: 'Life insurance', desc: 'Family planning and long-term financial protection.' },
    ],
  },
  arc: {
    taglineEs: 'Plataforma SaaS que simplifica procesos y acelera el crecimiento de tu negocio.',
    taglineEn: 'SaaS platform that simplifies processes and accelerates your business growth.',
    ctaPrimaryEs: 'Probar gratis', ctaPrimaryEn: 'Try for free',
    ctaSecondaryEs: 'Ver demo', ctaSecondaryEn: 'View demo',
    es: [
      { title: 'Automatización', desc: 'Flujos de trabajo inteligentes que eliminan tareas repetitivas.' },
      { title: 'Analítica en tiempo real', desc: 'Dashboards con métricas clave para decisiones informadas.' },
      { title: 'Integraciones', desc: 'Conexión con las herramientas que ya usas: CRM, email y facturación.' },
    ],
    en: [
      { title: 'Automation', desc: 'Smart workflows that eliminate repetitive tasks.' },
      { title: 'Real-time analytics', desc: 'Dashboards with key metrics for informed decisions.' },
      { title: 'Integrations', desc: 'Connect with tools you already use: CRM, email, and billing.' },
    ],
  },
  vault: {
    taglineEs: 'Soluciones fintech seguras para pagos, transferencias y gestión financiera digital.',
    taglineEn: 'Secure fintech solutions for payments, transfers, and digital financial management.',
    ctaPrimaryEs: 'Crear cuenta', ctaPrimaryEn: 'Create account',
    ctaSecondaryEs: 'Ver funciones', ctaSecondaryEn: 'View features',
    es: [
      { title: 'Pagos instantáneos', desc: 'Transferencias y cobros en segundos con máxima seguridad.' },
      { title: 'Tarjetas virtuales', desc: 'Emisión inmediata para compras online y control de gastos.' },
      { title: 'Panel financiero', desc: 'Visión unificada de ingresos, gastos y flujo de caja en tiempo real.' },
    ],
    en: [
      { title: 'Instant payments', desc: 'Transfers and collections in seconds with maximum security.' },
      { title: 'Virtual cards', desc: 'Immediate issuance for online purchases and expense control.' },
      { title: 'Financial dashboard', desc: 'Unified view of income, expenses, and cash flow in real time.' },
    ],
  },
  neural: {
    taglineEs: 'Soluciones de inteligencia artificial y machine learning para empresas innovadoras.',
    taglineEn: 'Artificial intelligence and machine learning solutions for innovative companies.',
    ctaPrimaryEs: 'Ver soluciones', ctaPrimaryEn: 'View solutions',
    ctaSecondaryEs: 'Agendar demo', ctaSecondaryEn: 'Schedule demo',
    es: [
      { title: 'Modelos predictivos', desc: 'Análisis de datos para anticipar tendencias y optimizar decisiones.' },
      { title: 'Procesamiento de lenguaje', desc: 'Chatbots, clasificación de texto y análisis de sentimiento.' },
      { title: 'Visión artificial', desc: 'Detección de objetos, OCR y control de calidad automatizado.' },
    ],
    en: [
      { title: 'Predictive models', desc: 'Data analysis to anticipate trends and optimize decisions.' },
      { title: 'Language processing', desc: 'Chatbots, text classification, and sentiment analysis.' },
      { title: 'Computer vision', desc: 'Object detection, OCR, and automated quality control.' },
    ],
  },
  sentinel: {
    taglineEs: 'Ciberseguridad empresarial con protección proactiva contra amenazas digitales.',
    taglineEn: 'Enterprise cybersecurity with proactive protection against digital threats.',
    ctaPrimaryEs: 'Auditoría gratuita', ctaPrimaryEn: 'Free audit',
    ctaSecondaryEs: 'Ver servicios', ctaSecondaryEn: 'View services',
    es: [
      { title: 'Auditoría de seguridad', desc: 'Análisis de vulnerabilidades y plan de remediación prioritizado.' },
      { title: 'Monitorización 24/7', desc: 'Detección y respuesta ante incidentes en tiempo real.' },
      { title: 'Formación en ciberseguridad', desc: 'Capacitación de equipos para prevenir phishing y fugas de datos.' },
    ],
    en: [
      { title: 'Security audit', desc: 'Vulnerability analysis and prioritized remediation plan.' },
      { title: '24/7 monitoring', desc: 'Real-time incident detection and response.' },
      { title: 'Cybersecurity training', desc: 'Team training to prevent phishing and data leaks.' },
    ],
  },
  codecraft: {
    taglineEs: 'Agencia de desarrollo web y software a medida con código limpio y plazos cumplidos.',
    taglineEn: 'Custom web and software development agency with clean code and on-time delivery.',
    ctaPrimaryEs: 'Ver proyectos', ctaPrimaryEn: 'View projects',
    ctaSecondaryEs: 'Solicitar presupuesto', ctaSecondaryEn: 'Get a quote',
    es: [
      { title: 'Desarrollo web', desc: 'Sitios y aplicaciones responsive con las últimas tecnologías.' },
      { title: 'Apps móviles', desc: 'iOS y Android nativos o cross-platform según tus necesidades.' },
      { title: 'Mantenimiento & soporte', desc: 'Actualizaciones, corrección de bugs y evolución continua.' },
    ],
    en: [
      { title: 'Web development', desc: 'Responsive sites and applications with latest technologies.' },
      { title: 'Mobile apps', desc: 'Native or cross-platform iOS and Android as needed.' },
      { title: 'Maintenance & support', desc: 'Updates, bug fixes, and continuous evolution.' },
    ],
  },
  cloudline: {
    taglineEs: 'Infraestructura cloud escalable, segura y optimizada para tu negocio digital.',
    taglineEn: 'Scalable, secure, and optimized cloud infrastructure for your digital business.',
    ctaPrimaryEs: 'Ver planes', ctaPrimaryEn: 'View plans',
    ctaSecondaryEs: 'Consulta técnica', ctaSecondaryEn: 'Technical consultation',
    es: [
      { title: 'Migración cloud', desc: 'Traslado seguro de servidores y aplicaciones a AWS, Azure o GCP.' },
      { title: 'DevOps & CI/CD', desc: 'Pipelines automatizados para despliegues rápidos y sin errores.' },
      { title: 'Monitorización', desc: 'Alertas, logs y métricas para garantizar uptime del 99.9%.' },
    ],
    en: [
      { title: 'Cloud migration', desc: 'Secure transfer of servers and applications to AWS, Azure, or GCP.' },
      { title: 'DevOps & CI/CD', desc: 'Automated pipelines for fast, error-free deployments.' },
      { title: 'Monitoring', desc: 'Alerts, logs, and metrics to guarantee 99.9% uptime.' },
    ],
  },
  volt: {
    taglineEs: 'Impulsamos el futuro con energía limpia, ahorro y autonomía energética.',
    taglineEn: 'Powering the future with clean energy, savings and energy independence.',
    ctaPrimaryEs: 'Solicitar estudio gratuito', ctaPrimaryEn: 'Request free assessment',
    ctaSecondaryEs: 'Ver servicios', ctaSecondaryEn: 'View services',
    es: [
      { title: 'Energía Solar Fotovoltaica', desc: 'Instalaciones de autoconsumo para viviendas, empresas y naves industriales.' },
      { title: 'Baterías y Almacenamiento', desc: 'Almacena el excedente y maximiza tu independencia energética.' },
      { title: 'Puntos de Recarga EV', desc: 'Cargadores Wallbox y soluciones para flotas y parkings.' },
      { title: 'Eficiencia Energética', desc: 'Auditorías, optimización de consumo y certificaciones.' },
      { title: 'Mantenimiento e Instalaciones', desc: 'Monitorización remota, revisiones y soporte técnico certificado.' },
    ],
    en: [
      { title: 'Solar Photovoltaic Energy', desc: 'Self-consumption installations for homes, businesses and industrial sites.' },
      { title: 'Batteries & Storage', desc: 'Store surplus energy and maximize your independence.' },
      { title: 'EV Charging Points', desc: 'Wallbox chargers and solutions for fleets and parking.' },
      { title: 'Energy Efficiency', desc: 'Audits, consumption optimization and certifications.' },
      { title: 'Maintenance & Installations', desc: 'Remote monitoring, inspections and certified technical support.' },
    ],
  },
  blueprint: {
    taglineEs: 'Arquitectura contemporánea con visión espacial, funcionalidad y diseño atemporal.',
    taglineEn: 'Contemporary architecture with spatial vision, function and timeless design.',
    ctaPrimaryEs: 'Ver proyectos', ctaPrimaryEn: 'View projects',
    ctaSecondaryEs: 'Consulta inicial', ctaSecondaryEn: 'Initial consultation',
    es: [
      { title: 'Arquitectura residencial', desc: 'Viviendas unifamiliares y reformas integrales con criterio estético y normativo.' },
      { title: 'Proyectos comerciales', desc: 'Locales, oficinas y espacios de trabajo con identidad propia.' },
      { title: 'Interiorismo', desc: 'Distribución, materiales y mobiliario para espacios habitables y premium.' },
    ],
    en: [
      { title: 'Residential architecture', desc: 'Single-family homes and full renovations with aesthetic and regulatory rigor.' },
      { title: 'Commercial projects', desc: 'Retail, offices and workspaces with a distinct identity.' },
      { title: 'Interior design', desc: 'Layout, materials and furniture for premium living spaces.' },
    ],
  },
  care: {
    taglineEs: 'Atención sanitaria cercana, profesional y centrada en el bienestar del paciente.',
    taglineEn: 'Close, professional healthcare focused on patient wellbeing.',
    ctaPrimaryEs: 'Pedir cita', ctaPrimaryEn: 'Book appointment',
    ctaSecondaryEs: 'Nuestros servicios', ctaSecondaryEn: 'Our services',
    es: [
      { title: 'Consulta y diagnóstico', desc: 'Primera visita, evaluación personalizada y plan de tratamiento.' },
      { title: 'Tratamientos especializados', desc: 'Protocolos actualizados con tecnología y evidencia clínica.' },
      { title: 'Seguimiento', desc: 'Control periódico, resultados medibles y atención continuada.' },
    ],
    en: [
      { title: 'Consultation & diagnosis', desc: 'First visit, personalized assessment and treatment plan.' },
      { title: 'Specialized treatments', desc: 'Up-to-date protocols with technology and clinical evidence.' },
      { title: 'Follow-up', desc: 'Periodic check-ups, measurable results and ongoing care.' },
    ],
  },
  haven: {
    taglineEs: 'Escapadas rurales con encanto, naturaleza y hospitalidad de calidad.',
    taglineEn: 'Rural getaways with charm, nature and quality hospitality.',
    ctaPrimaryEs: 'Reservar estancia', ctaPrimaryEn: 'Book your stay',
    ctaSecondaryEs: 'Ver alojamientos', ctaSecondaryEn: 'View accommodations',
    es: [
      { title: 'Habitaciones y suites', desc: 'Alojamiento acogedor con detalles cuidados y vistas al entorno.' },
      { title: 'Experiencias locales', desc: 'Rutas, gastronomía y actividades en la naturaleza.' },
      { title: 'Eventos íntimos', desc: 'Celebraciones pequeñas, retiros y estancias en grupo.' },
    ],
    en: [
      { title: 'Rooms & suites', desc: 'Cozy accommodation with thoughtful details and scenic views.' },
      { title: 'Local experiences', desc: 'Trails, gastronomy and outdoor activities.' },
      { title: 'Intimate events', desc: 'Small celebrations, retreats and group stays.' },
    ],
  },
};

const DEFAULT_PRESET: ContentPreset = {
  taglineEs: 'Experiencia premium adaptada a las necesidades de tu negocio.',
  taglineEn: 'Premium experience tailored to your business needs.',
  ctaPrimaryEs: 'Descubrir más', ctaPrimaryEn: 'Discover more',
  ctaSecondaryEs: 'Contactar', ctaSecondaryEn: 'Contact',
  es: [
    { title: 'Servicio principal', desc: 'Solución profesional con la máxima calidad y atención personalizada.' },
    { title: 'Experiencia premium', desc: 'Detalles cuidados que marcan la diferencia en cada interacción.' },
    { title: 'Atención personalizada', desc: 'Equipo dedicado que entiende y responde a tus necesidades.' },
  ],
  en: [
    { title: 'Core service', desc: 'Professional solution with top quality and personalized attention.' },
    { title: 'Premium experience', desc: 'Carefully crafted details that make every interaction count.' },
    { title: 'Personalized care', desc: 'Dedicated team that understands and responds to your needs.' },
  ],
};

export function getContentPreset(slug: string): ContentPreset {
  return CONTENT_PRESETS[slug] ?? DEFAULT_PRESET;
}
