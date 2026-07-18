/**
 * Prueba local del motor prompt-first (solo máquina).
 * Uso: npm run test:kebab-local
 * Salida: tmp/local-kebab-hut.html
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generateSiteFromUserPrompt } from '../app/lib/ai/promptFirstSiteGenerator';
import { getEngineHealth } from '../app/lib/ai/engineHealth';
import { countHtmlImages, isWireframeHtml } from '../app/lib/ai/promptFirstQuality';

const BRIEF = `CONTEXTO
Quiero crear una página web completamente nueva para un restaurante de comida turca llamado Kebab Hut.
No quiero una web sencilla.
No quiero una plantilla.
No quiero Bootstrap.
No quiero nada que parezca generado automáticamente.
Quiero una web que parezca diseñada por una agencia internacional especializada en branding gastronómico.
Debe transmitir calidad, limpieza, confianza, autenticidad y modernidad.
La inspiración visual debe ser similar a restaurantes premium como Nusr-Et, Dishoom, Big Mamma o los mejores restaurantes modernos de Londres y Madrid.
La sensación general debe ser:
"Este restaurante parece muchísimo mejor de lo que cuesta comer allí."
DATOS DEL NEGOCIO
Nombre:
Kebab Hut
Categoría:
Restaurante especializado en auténtico Doner Kebab.
Dirección:
Calle Pilar Nogueiro 2
Esquina con
Calle Puerto Canfranc 54
28038 Madrid
Horario
Todos los días
Abierto
Hasta las 00:00
Precio medio
Entre 1 € y 10 €
Google
3,9 ⭐
Más de 100 opiniones.
No mostrar la puntuación de forma destacada en el Hero. La web debe centrarse en la calidad del restaurante y no en las reseñas.
OBJETIVO
La web debe hacer que cualquier persona tenga ganas de ir a comer.
Debe transmitir:
Ingredientes frescos.
Carne auténtica.
Recetas tradicionales.
Servicio rápido.
Local limpio.
Comida preparada al momento.
Autenticidad.
IDENTIDAD VISUAL
Estilo premium.
Minimalista.
Elegante.
Oscuro.
Fotografía protagonista.
Mucho espacio en blanco.
Tipografía elegante.
Microanimaciones.
Nada recargado.
PALETA
Blanco
Negro
Gris oscuro
Rojo intenso (#D62828)
Toques dorados muy discretos
Nunca utilizar muchos colores.
TIPOGRAFÍA
Playfair Display para títulos.
Inter para textos.
Mucho tamaño.
Mucho aire.
HERO
Pantalla completa.
Fotografía espectacular ocupando toda la pantalla.
Overlay oscuro.
Navbar transparente.
Al hacer scroll la navbar se convierte en blanco con efecto cristal (glassmorphism).
Badge superior
"AUTÉNTICO DONER KEBAB"
Título
Sabores auténticos que conquistan Madrid
Subtítulo
Carne marinada durante horas, ingredientes frescos y recetas tradicionales servidas cada día en el corazón de Vallecas.
Botón principal
Ver Menú
Botón secundario
Cómo llegar
Indicador animado para hacer scroll.
SOBRE NOSOTROS
Bloque dividido en dos columnas.
Una fotografía muy grande.
Texto elegante.
Hablar sobre:
Tradición.
Ingredientes.
Preparación artesanal.
Pasión.
No inventar historias falsas.
ESPECIALIDADES
Mostrar tarjetas premium para:
Doner Kebab
Durum
Box Kebab
Platos combinados
Falafel
Menús completos
Cada tarjeta debe tener:
Imagen grande
Nombre
Descripción breve
Hover elegante
GALERÍA
No hacer una cuadrícula simple.
Crear una composición visual moderna.
Imágenes grandes.
Hover con zoom.
Lightbox.
Animaciones.
POR QUÉ ELEGIRNOS
Iconos premium.
Preparado al momento.
Ingredientes frescos.
Carne marinada.
Excelente relación calidad-precio.
Servicio rápido.
Ubicación céntrica.
EXPERIENCIA
Crear una sección tipo storytelling.
Grandes fotografías.
Fondos oscuros.
Mucho espacio.
Frases inspiradoras.
RESEÑAS
Mostrar únicamente opiniones positivas reales (si el propietario las proporciona más adelante). Mientras tanto, usar un carrusel preparado para integrarlas, sin inventar testimonios.
UBICACIÓN
Mapa integrado.
Dirección completa.
Botón
Cómo llegar con Google Maps.
CTA FINAL
Gran imagen de fondo.
Título
¿Preparado para probar un auténtico Doner Kebab?
Botón
Ven a visitarnos
FOOTER
Elegante.
Oscuro.
Logo.
Horario.
Dirección.
Mapa.
Redes sociales.
Copyright.
EFECTOS
Intersection Observer.
Fade In.
Slide Up.
Parallax muy suave.
Hover elegante.
Animaciones CSS.
Glassmorphism.
Sombras suaves.
Backdrop Blur.
Botones con animaciones.
Nada exagerado.
RESPONSIVE
Perfecto desde 320 px.
Tablet.
Desktop.
4K.
SEO
Meta Title.
Meta Description.
Schema Restaurant.
Open Graph.
Twitter Cards.
Datos estructurados.
Alt en todas las imágenes.
RENDIMIENTO
100/100 Lighthouse.
Lazy Loading.
Imágenes WebP.
Sin librerías innecesarias.
Código limpio.
HTML semántico.
CSS organizado.
JavaScript modular.
ACCESIBILIDAD
Cumplir WCAG AA.
ARIA Labels.
Contraste correcto.
Navegación mediante teclado.
CALIDAD FINAL
Antes de finalizar, revisa el resultado como si fueras un director creativo de una agencia de diseño web de lujo.
No entregues una web "correcta".
Entrega una web que pueda formar parte del portfolio de una agencia premium y que un cliente aceptaría pagar entre 2.000 y 5.000 € por su diseño y desarrollo.
Cada detalle visual debe transmitir calidad, confianza y deseo de visitar el restaurante. El resultado debe ser moderno, elegante y memorable, diferenciándose claramente de las típicas páginas de kebabs genéricas.`;

async function main() {
  const health = getEngineHealth();
  console.log('\n=== Prueba local Kebab Hut (prompt-first) ===\n');
  console.log(`IA: ${health.aiEnabled ? 'habilitada' : 'NO — sin claves, caerá a fallback'}`);
  if (health.warnings?.length) health.warnings.forEach((w) => console.log(`  ⚠ ${w}`));

  const started = Date.now();
  const result = await generateSiteFromUserPrompt(BRIEF, 'es');
  const ms = Date.now() - started;

  if (!result.ok || !result.previewSections[0]?.html) {
    console.error('FAIL: no se generó HTML', result);
    process.exit(1);
  }

  const html = result.previewSections[0].html;
  const outDir = join(process.cwd(), 'tmp');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'local-kebab-hut.html');
  writeFileSync(outPath, html, 'utf8');

  const checks = {
    kebabHut: /Kebab Hut/i.test(html),
    playfair: /Playfair/i.test(html),
    inter: /Inter/i.test(html),
    red: /#D62828|D62828/i.test(html),
    heroTitle: /Sabores auténticos que conquistan Madrid/i.test(html),
    address: /Pilar Nogueiro|Puerto Canfranc/i.test(html),
    durum: /Durum/i.test(html),
    noBootstrap: !/bootstrap/i.test(html),
    schema: /schema\.org|application\/ld\+json/i.test(html),
    wireframe: isWireframeHtml(html),
    images: countHtmlImages(html),
    bytes: html.length,
  };

  console.log(`\nOK en ${ms}ms`);
  console.log(`Mensaje: ${result.message}`);
  console.log(`Source: ${result.source} · stage: ${result.pipelineStage} · provider: ${result.providersUsed?.join(',')}`);
  console.log(`Fal images: ${result.falImages ?? 0}`);
  console.log(`Archivo: ${outPath}`);
  console.log('\nChecks:');
  for (const [k, v] of Object.entries(checks)) {
    console.log(`  ${k}: ${v}`);
  }

  const criticalFail =
    checks.wireframe ||
    !checks.kebabHut ||
    !checks.heroTitle ||
    checks.images < 4 ||
    !checks.noBootstrap;

  process.exit(criticalFail ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
