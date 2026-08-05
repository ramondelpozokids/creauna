/**
 * Rebuild MENU_I18N.it from Spanish with real Italian translations.
 */
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../../menu-i18n.js');
const raw = fs.readFileSync(file, 'utf8');
const data = Function(`return (${raw.replace(/^window\.MENU_I18N\s*=\s*/, '').replace(/;\s*$/, '')})`)();

/** Full Italian map for every Spanish key used on the carta */
const IT = {
  d_carabinero: 'Carabinero',
  d_salmonete: 'Triglia',
  d_pargo: 'Pagro',
  d_hurtado: 'Gallinella',
  d_dorada_salvaje: 'Orata selvatica',
  d_borriquete: 'Pagello',
  d_pipirrana_de_gambas_y_pulpo: 'Pipirrana di gamberi e polpo',
  d_pipirrana_rucula_y_aguacate: 'Pipirrana con rucola e avocado',
  d_ensalada_mixta: 'Insalata mista',
  d_ensalada_de_atun: 'Insalata di tonno',
  d_ensalada_los_leones: 'Insalata Los Leones',
  d_tomate_con_boquerones_en_vinagre: 'Pomodoro con acciughe in aceto',
  d_ensalada_de_pimientos: 'Insalata di peperoni',
  d_ensalada_caprese: 'Insalata Caprese',
  d_tomate_aguacate_y_gambas: 'Pomodoro, avocado e gamberi',
  d_ensalada_tropical: 'Insalata tropicale',
  d_gazpacho_andaluz: 'Gazpacho andaluso',
  d_porra_de_mango: 'Porra di mango',
  d_tartar_de_atun_con_aguacate: 'Tartare di tonno con avocado',
  d_boquerones_en_vinagre: 'Acciughe in aceto',
  d_anchoas_6_unidades: 'Acciughe (6 pezzi)',
  d_milhoja_del_mar: 'Millefoglie del mare',
  d_gambas_pil_pil: 'Gamberi pil-pil',
  d_langostinos_pil_pil: 'Mazzancolle pil-pil',
  d_timbal_de_gambas_pil_pil: 'Timballo di gamberi pil-pil',
  d_conchas_finas_unidad: 'Conchiglie fini (unità)',
  d_peregrina_unidad: 'Capasanta (unità)',
  d_almejitas_salteadas: 'Vongole saltate',
  d_coquinas: 'Coquinas',
  d_gambas_a_la_plancha_200g: 'Gamberi alla piastra (200g)',
  d_gambas_cocidas_200g: 'Gamberi lessati (200g)',
  d_zamburinas: 'Capesante piccole',
  d_mejillones_al_curry: 'Cozze al curry',
  d_langostinos_al_curry_con_arroz_blanco: 'Mazzancolle al curry con riso bianco',
  d_espeto_de_sardinas: 'Spiedo di sardine',
  d_calamar_a_la_plancha: 'Calamaro alla piastra',
  d_filete_de_pez_espada: 'Filetto di pesce spada',
  d_lenguado_a_la_plancha_300g: 'Sogliola alla piastra (300g)',
  d_pata_de_pulpo_al_espeto: 'Zampa di polpo allo spiedo',
  d_rosada_a_la_plancha: 'Rosada alla piastra',
  d_lubina_plancha_o_espeto_500g: 'Spigola alla piastra o spiedo (500g)',
  d_dorada_plancha_o_espeto_500g: 'Orata alla piastra o spiedo (500g)',
  d_salmon_a_la_plancha: 'Salmone alla piastra',
  d_boquerones: 'Acciughe fritte',
  d_gambas_fritas: 'Gamberi fritti',
  d_calamares: 'Calamari',
  d_calamaritos: 'Calamaretti',
  d_adobo: 'Adobo',
  d_rosada_ali_oli: 'Rosada allioli',
  d_salmonetitos: 'Triglie fritte',
  d_pulpo_frito_con_guacamole: 'Polpo fritto con guacamole',
  d_fritura_variada: 'Frittura mista',
  d_paella_de_marisco_y_pescado: 'Paella di frutti di mare e pesce',
  d_arroz_negro: 'Riso nero',
  d_arroz_caldoso: 'Riso in brodo',
  d_arroz_caldoso_con_carabineros: 'Riso in brodo con carabineri',
  d_gazpachuelo: 'Gazpachuelo',
  d_pescado_al_horno: 'Pesce al forno',
  d_filete_de_ternera: 'Filetto di manzo',
  d_entrecot_a_la_plancha: 'Entrecôte alla piastra',
  d_filete_de_pollo: 'Petto di pollo',
  d_escalope_de_ternera: 'Scaloppina di vitello',
  d_pollo_empanado: 'Pollo impanato',
  d_brocheta_de_ternera: 'Spiedino di manzo',
  d_brocheta_de_pollo: 'Spiedino di pollo',
  d_solomillo_de_cerdo_iberico: 'Filetto di maiale iberico',
  d_brocheta_de_solomillo_iberico: 'Spiedino di filetto iberico',
  d_hamburguesa_de_ternera: 'Hamburger di manzo',
  d_tarta_de_chocolate: 'Torta al cioccolato',
  d_tarta_de_queso: 'Torta al formaggio',
  d_tarta_de_queso_con_chocolate_y_avellana: 'Torta al formaggio con cioccolato e nocciola',
  d_tarta_de_queso_con_pistacho: 'Torta al formaggio con pistacchio',
  d_arroz_con_leche: 'Riso al latte',
  d_milhoja_de_manzana_con_helado: 'Millefoglie di mela con gelato',
  d_fruta_de_temporada: 'Frutta di stagione',
  d_vino_de_la_casa: 'Vino della casa',
  d_vino_rosado_de_la_casa: 'Vino rosato della casa',
  d_vino_tinto_de_la_casa: 'Vino rosso della casa',

  c_pescado_fresco_del_dia: 'Pesce fresco del giorno',
  c_ensaladas: 'Insalate',
  c_entremeses: 'Antipasti',
  c_mariscos: 'Frutti di mare',
  c_pescados: 'Pesce',
  c_fritos: 'Fritti',
  c_arroces_y_guisos: 'Risi e stufati',
  c_carnes: 'Carni',
  c_postres: 'Dolci',
  c_vinos: 'Vini',
  c_cocteles: 'Cocktail',
  c_blancos: 'Bianchi',
  c_rosados: 'Rosati',
  c_tintos: 'Rossi',
  c_espumosos: 'Spumanti',
  c_generosos: 'Vini liquorosi',

  p_lechuga_tomate_cebolla_zanahoria_y_aceit: 'Lattuga, pomodoro, cipolla, carota e olive verdi',
  p_lechuga_tomate_cebolla_zanahoria_atun_y_: 'Lattuga, pomodoro, cipolla, carota, tonno e olive verdi',
  p_lechuga_zanahoria_cebolla_aguacate_atun_: 'Lattuga, carota, cipolla, avocado, tonno, uovo, mais, pomodoro e olive',
  p_tomate_mozzarella_y_albahaca: 'Pomodoro, mozzarella e basilico',
  p_lechuga_tomate_maiz_aguacate_kiwi_fruta_: 'Lattuga, pomodoro, mais, avocado, kiwi, frutta di stagione e salsa rosa',
  p_con_guarnicion: 'Con contorno',
  p_con_guarnicion_de_gambas_aguacate_y_fres: 'Con contorno di gamberi, avocado e fragole',
  p_boquerones_en_vinagre_sardinitas_anchoas: 'Acciughe in aceto, sardine piccole, acciughe salate, pomodoro tritato e avocado',
  p_con_patatas_y_mayonesa: 'Con patate e maionese',
  p_con_mayonesa_de_piquillo: 'Con maionese di piquillo',
  p_minimo_para_2_personas: 'Minimo per 2 persone',
  p_sopa_tradicional_de_malaga_minimo_para_2: 'Zuppa tradizionale di Málaga. Minimo per 2 persone',
  p_segun_mercado: 'Secondo mercato',
  p_con_cebolla_tomate_y_pimiento: 'Con cipolla, pomodoro e peperone',
  p_con_patatas: 'Con patatine',
  p_verdejo_o_chardonnay: 'Verdejo o Chardonnay',
  p_vino_joven_ligero_con_matices_aromaticos: 'Vino giovane leggero, aromatico e fresco',
  p_tempranillo_o_garnacha: 'Tempranillo o Garnacha',
  p_notas_de_frutos_rojos_joven_y_con_caract: 'Note di frutti rossi, giovane e caratteristico',
  p_ribera_del_duero_o_rioja: 'Ribera del Duero o Rioja',
  p_st_germain_elderflower_prosecco_gaseosa_: 'St-Germain al sambuco, Prosecco, soda e menta',
  p_aperol_prosecco_y_gaseosa: 'Aperol, Prosecco e soda',
  p_aperol_clara_de_huevo_vodka_naranja_y_zu: 'Aperol, albume, vodka all’arancia e succo di limone',
  p_limoncello_prosecco_y_gaseosa_acompanado: 'Limoncello, Prosecco e soda con rosmarino',
  p_vino_rosado_lillet_by_monin_melocoton_si: 'Lillet Rosé, pesca Monin, sciroppo di pesca e soda',
  p_ron_hierba_buena_gaseosa_limon_y_azucar: 'Rum, menta, soda, limone e zucchero',
  p_licor_de_sandia_by_monin_red_fruit_sirop: 'Liquore di anguria, frutti rossi Monin, sciroppo di rosa, Prosecco e soda',
  p_mosura_hierba_buena_gaseosa_limon_fresa_: 'Mosura, menta, soda, limone, fragola, arancia e zucchero',
  p_ron_blanco_pure_de_coco_pina_natural_y_z: 'Rum bianco, purea di cocco, ananas fresco e succo',
  p_vodka_licor_fruta_de_la_pasion_pure_de_f: 'Vodka, liquore di frutto della passione, purea di passion fruit e lime',
  p_tequila_reposado_cardial_de_romero_sirop: 'Tequila reposado, cordial di rosmarino, sciroppo di rosa, lime e soda al pompelmo',

  n_albaricoque_fruta_de_hueso_madura_toques_tropicale: 'Albicocca, frutta a nocciolo matura, note tropicali. Salinità evidente, equilibrato',
  n_flor_blanca_fruta_blanca_citricos_mineral_con_buen: 'Fiore bianco, frutta bianca, agrumi. Minerale, buona acidità',
  n_frutas_tropicales_melocoton_manzana_verde_volumino: 'Frutti tropicali, pesca, mela verde. Corposo',
  n_afrutado_expresivo_con_notas_de_pomelo_y_flor_blan: 'Fruttato ed espressivo, con note di pompelmo e fiore bianco',
  n_potente_con_notas_de_fruta_fresca_paladar_fresco_y: 'Potente, note di frutta fresca. Palato fresco ed equilibrato',
  n_frutas_tropicales_fruta_de_la_pasion_citricos_untu: 'Frutti tropicali, frutto della passione, agrumi. Vellutato ed elegante',
  n_pina_maracuya_citricos_manzana_verde_fresco_y_equi: 'Ananas, passion fruit, agrumi, mela verde. Fresco ed equilibrato',
  n_notas_florales_jazmin_violetas_hinojo_mango_textur: 'Note floreali, gelsomino, violette, finocchio, mango. Texture setosa',
  n_fresa_y_frambuesa_con_toques_citricos_y_florales: 'Fragola e lampone, con tocchi agrumati e floreali',
  n_elegante_y_sutil_fresa_frambuesa_granada: 'Elegante e sottile, fragola, lampone, melograno',
  n_melocoton_citricos_y_frutos_rojos_fresco_y_sedoso: 'Pesca, agrumi e frutti rossi. Fresco e setoso',
  n_frutas_rojas_frescas_citricos_flores_blancas_elega: 'Frutti rossi freschi, agrumi, fiori bianchi. Elegante',
  n_fresa_cereza_y_sandia_fresco_y_ligero: 'Fragola, ciliegia e anguria. Fresco e leggero',
  n_frutos_rojos_hierba_sotobosque_balsamicos: 'Frutti rossi, erbe, sottobosco, balsamici',
  n_fruta_negra_moras_arandanos_cremoso_y_fresco: 'Frutta nera, more, mirtilli. Cremoso e fresco',
  n_fruta_roja_y_negra_regaliz_jengibre_elegante: 'Frutta rossa e nera, liquirizia, zenzero. Elegante',
  n_cerezas_ciruelas_especias_intenso_y_complejo: 'Ciliegie, prugne, spezie. Intenso e complesso',
  n_fruta_negra_madura_notas_de_barrica_carnoso: 'Frutta nera matura, note di botte. Carnoso',
  n_frutos_maduros_especias_dulces_envolvente: 'Frutti maturi, spezie dolci. Avvolgente',
  n_fruta_roja_madura_notas_especiadas_estructurado: 'Frutta rossa matura, note speziate. Strutturato',
  n_terrosa_especiada_madera_y_fruta_potente: 'Terroso, speziato, legno e frutta. Potente',
  n_manzana_fresca_flores_blancas_pan_tostado: 'Mela fresca, fiori bianchi, pane tostato',
  n_frutas_amarillas_vainilla_brioche: 'Frutti gialli, vaniglia, brioche',
  n_manzana_verde_citricos_flores_blancas: 'Mela verde, agrumi, fiori bianchi',
  n_levadura_frutos_secos_manzana_asada: 'Lievito, frutta secca, mela al forno',
  n_aromas_punzantes_notas_almendradas: 'Aromi pungenti, note di mandorla',
  n_datiles_maderas_y_tostados_dulce_y_elegante: 'Datteri, legni e tostati. Dolce ed elegante'
};

const it = {};
for (const key of Object.keys(data.es)) {
  if (IT[key]) {
    it[key] = IT[key];
  } else if (/^(d_|c_|p_|n_)/.test(key) === false) {
    it[key] = data.es[key];
  } else {
    // Keep brand / wine proper names from ES when no map (e.g. Ramón Bilbao)
    it[key] = data.es[key];
  }
}

data.it = it;
fs.writeFileSync(file, `window.MENU_I18N = ${JSON.stringify(data, null, 2)};\n`, 'utf8');

const missing = Object.keys(data.es).filter((k) => !IT[k] && /^(d_|c_|p_|n_)/.test(k));
const englishLeft = Object.keys(it).filter((k) => /^(Fresh|Salad|Starter|Seafood|Prawn|Grilled|Mixed)/i.test(it[k]));
console.log('IT keys:', Object.keys(it).length);
console.log('Unmapped (kept ES):', missing.length);
console.log('Still English-looking:', englishLeft.length, englishLeft.slice(0, 10));
console.log('Sample:', it.c_pescado_fresco_del_dia, '|', it.c_ensaladas, '|', it.d_carabinero);
