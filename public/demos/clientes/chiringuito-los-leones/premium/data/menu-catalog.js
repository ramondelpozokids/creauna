/**
 * Interactive menu catalog — prices/names from the published carta.
 * Images: only real photos that match the dish 1:1. Empty = no photo (never invent).
 */
export const ALLERGENS = ['gluten', 'crustaceans', 'eggs', 'fish', 'milk', 'molluscs', 'sulphites', 'soy'];

export const CATEGORIES = [
  { id: 'sugerencias', label: { es: 'Sugerencias', en: 'Suggestions', fr: 'Suggestions', de: 'Vorschläge', it: 'Suggerimenti' } },
  { id: 'ensaladas', label: { es: 'Ensaladas', en: 'Salads', fr: 'Salades', de: 'Salate', it: 'Insalate' } },
  { id: 'entremeses', label: { es: 'Entremeses', en: 'Starters', fr: 'Entrées', de: 'Vorspeisen', it: 'Antipasti' } },
  { id: 'mariscos', label: { es: 'Mariscos', en: 'Seafood', fr: 'Fruits de mer', de: 'Meeresfrüchte', it: 'Frutti di mare' } },
  { id: 'pescado', label: { es: 'Pescado', en: 'Fish', fr: 'Poisson', de: 'Fisch', it: 'Pesce' } },
  { id: 'frito', label: { es: 'Frito', en: 'Fried', fr: 'Fritures', de: 'Frittiert', it: 'Fritti' } },
  { id: 'arroces', label: { es: 'Arroces', en: 'Rice', fr: 'Riz', de: 'Reis', it: 'Risi' } },
  { id: 'carnes', label: { es: 'Carnes', en: 'Meats', fr: 'Viandes', de: 'Fleisch', it: 'Carni' } },
  { id: 'postres', label: { es: 'Postres', en: 'Desserts', fr: 'Desserts', de: 'Desserts', it: 'Dolci' } }
];

/**
 * Real gallery photos (images/1–10.png) → one dish only:
 * 1 almejas · 2 hamburguesa · 3 boquerones en vinagre · 4 brocheta
 * 6 gazpacho · 8 pulpo · 9 gambas/carabinero style · 10 atún
 */
/** @type {Array<{id:string,name:string,price:string,category:string,allergens:string[],image:string,recommended?:boolean}>} */
export const MENU_ITEMS = [
  { id: 'd_carabinero', name: 'Carabinero', price: '36€ / 200g', category: 'sugerencias', allergens: ['crustaceans'], image: 'images/9.png', recommended: true },
  { id: 'd_dorada_salvaje', name: 'Dorada Salvaje', price: '75€ / kg', category: 'sugerencias', allergens: ['fish'], image: '' },
  { id: 'd_salmonete', name: 'Salmonete', price: '60€ / kg', category: 'sugerencias', allergens: ['fish'], image: '' },
  { id: 'd_pargo', name: 'Pargo', price: '60€ / kg', category: 'sugerencias', allergens: ['fish'], image: '' },

  { id: 'd_pipirrana_de_gambas_y_pulpo', name: 'Pipirrana de Gambas y Pulpo', price: '14,50€', category: 'ensaladas', allergens: ['crustaceans', 'molluscs'], image: '', recommended: true },
  { id: 'd_ensalada_los_leones', name: 'Ensalada Los Leones', price: '13,00€', category: 'ensaladas', allergens: ['eggs', 'fish'], image: '' },
  { id: 'd_ensalada_mixta', name: 'Ensalada Mixta', price: '8,50€', category: 'ensaladas', allergens: [], image: '' },
  { id: 'd_ensalada_de_atun', name: 'Ensalada de Atún', price: '10,50€', category: 'ensaladas', allergens: ['fish'], image: '' },
  { id: 'd_tomate_aguacate_y_gambas', name: 'Tomate, Aguacate y Gambas', price: '19,00€', category: 'ensaladas', allergens: ['crustaceans'], image: '' },
  { id: 'd_ensalada_caprese', name: 'Ensalada Caprese', price: '12,00€', category: 'ensaladas', allergens: ['milk'], image: '' },

  { id: 'd_gazpacho_andaluz', name: 'Gazpacho Andaluz', price: '6,50€', category: 'entremeses', allergens: [], image: 'images/6.png' },
  { id: 'd_tartar_de_atun_con_aguacate', name: 'Tartar de Atún con Aguacate', price: '23,00€', category: 'entremeses', allergens: ['fish'], image: '', recommended: true },
  { id: 'd_boquerones_en_vinagre', name: 'Boquerones en Vinagre', price: '14,00€', category: 'entremeses', allergens: ['fish'], image: 'images/3.png' },
  { id: 'd_gambas_pil_pil', name: 'Gambas Pil-Pil', price: '14,00€', category: 'entremeses', allergens: ['crustaceans'], image: '', recommended: true },
  { id: 'd_milhoja_del_mar', name: 'Milhoja del Mar', price: '19,50€', category: 'entremeses', allergens: ['fish', 'crustaceans', 'gluten'], image: '' },

  { id: 'd_almejitas_salteadas', name: 'Almejitas Salteadas', price: '16,50€', category: 'mariscos', allergens: ['molluscs'], image: 'images/1.png', recommended: true },
  { id: 'd_coquinas', name: 'Coquinas', price: '19,00€', category: 'mariscos', allergens: ['molluscs'], image: '' },
  { id: 'd_gambas_a_la_plancha_200g', name: 'Gambas a la Plancha (200g)', price: '26,00€', category: 'mariscos', allergens: ['crustaceans'], image: '' },
  { id: 'd_zamburinas', name: 'Zamburiñas', price: '17,00€', category: 'mariscos', allergens: ['molluscs'], image: '' },

  { id: 'd_espeto_de_sardinas', name: 'Espeto de Sardinas', price: '8,50€', category: 'pescado', allergens: ['fish'], image: '', recommended: true },
  { id: 'd_pata_de_pulpo_al_espeto', name: 'Pata de Pulpo al Espeto', price: '23,00€', category: 'pescado', allergens: ['molluscs'], image: 'images/8.png', recommended: true },
  { id: 'd_lubina_plancha_o_espeto_500g', name: 'Lubina Plancha o Espeto (500g)', price: '24,00€', category: 'pescado', allergens: ['fish'], image: '' },
  { id: 'd_dorada_plancha_o_espeto_500g', name: 'Dorada Plancha o Espeto (500g)', price: '24,00€', category: 'pescado', allergens: ['fish'], image: '' },
  { id: 'd_calamar_a_la_plancha', name: 'Calamar a la Plancha', price: '23,00€', category: 'pescado', allergens: ['molluscs'], image: '' },
  { id: 'd_filete_de_pez_espada', name: 'Filete de Pez Espada', price: '21,00€', category: 'pescado', allergens: ['fish'], image: '' },

  { id: 'd_boquerones', name: 'Boquerones', price: '13,00€', category: 'frito', allergens: ['fish', 'gluten'], image: '' },
  { id: 'd_calamares', name: 'Calamares', price: '16,50€', category: 'frito', allergens: ['molluscs', 'gluten'], image: '' },
  { id: 'd_fritura_variada', name: 'Fritura Variada', price: '34,00€', category: 'frito', allergens: ['fish', 'molluscs', 'crustaceans', 'gluten'], image: '', recommended: true },
  { id: 'd_pulpo_frito_con_guacamole', name: 'Pulpo Frito con Guacamole', price: '23,00€', category: 'frito', allergens: ['molluscs', 'gluten'], image: '' },

  { id: 'd_paella_de_marisco_y_pescado', name: 'Paella de Marisco y Pescado', price: '35,00€', category: 'arroces', allergens: ['fish', 'crustaceans', 'molluscs'], image: '', recommended: true },
  { id: 'd_arroz_negro', name: 'Arroz Negro', price: '35,00€', category: 'arroces', allergens: ['molluscs'], image: '' },
  { id: 'd_arroz_caldoso_con_carabineros', name: 'Arroz Caldoso con Carabineros', price: '56,00€', category: 'arroces', allergens: ['crustaceans'], image: '', recommended: true },

  { id: 'd_entrecot_a_la_plancha', name: 'Entrecot a la Plancha', price: '23,00€', category: 'carnes', allergens: [], image: '' },
  { id: 'd_brocheta_de_ternera', name: 'Brocheta de Ternera', price: '25,00€', category: 'carnes', allergens: [], image: 'images/4.png' },
  { id: 'd_hamburguesa_de_ternera', name: 'Hamburguesa de Ternera', price: '9,00€', category: 'carnes', allergens: ['gluten', 'eggs', 'milk'], image: 'images/2.png' },
  { id: 'd_solomillo_de_cerdo_iberico', name: 'Solomillo de Cerdo Ibérico', price: '21,00€', category: 'carnes', allergens: [], image: '' },

  { id: 'd_tarta_de_queso', name: 'Tarta de Queso', price: '6,00€', category: 'postres', allergens: ['milk', 'eggs', 'gluten'], image: '' },
  { id: 'd_tarta_de_chocolate', name: 'Tarta de Chocolate', price: '6,00€', category: 'postres', allergens: ['milk', 'eggs', 'gluten'], image: '' },
  { id: 'd_milhoja_de_manzana_con_helado', name: 'Milhoja de Manzana con Helado', price: '6,50€', category: 'postres', allergens: ['milk', 'gluten'], image: '' },
  { id: 'd_fruta_de_temporada', name: 'Fruta de Temporada', price: '5,00€', category: 'postres', allergens: [], image: '' }
];
