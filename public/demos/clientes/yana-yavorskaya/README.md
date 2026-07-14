# Yana Yavorskaya — Sitio Web Oficial

Sitio web de pintora contemporánea. Experiencia inmersiva estilo galería con 6 idiomas, modo museo, chat assistant, precios visibles, obras disponibles.

🌍 Español · English · Français · Deutsch · Русский · Italiano

## 📁 Estructura

```
├── index.html              ← Inicio (hero, colecciones, estudio, exposiciones, contacto)
├── obras-disponibles.html  ← Galería privada con precios visibles
├── noticias.html           ← Ferias, exposiciones y eventos (Feriarte, Art Madrid, ARCO)
├── sobre-mi.html           ← Biografía completa de la artista
├── 404.html                ← Página no encontrada
├── vercel.json             ← Config de despliegue
├── css/museum.css          ← Diseño editorial minimalista
├── js/
│   ├── db.js               ← IndexedDB (favoritos, backup)
│   ├── i18n.js             ← Motor de traducción (6 idiomas)
│   └── museum.js           ← Lógica: nav, museo, chat, favoritos
├── assets/
│   ├── logo.png            ← Logo de Yana Yavorskaya
│   └── obras/              ← Imágenes de las obras
└── legal/
    ├── aviso-legal.html    ← Aviso legal multilingüe
    ├── privacidad.html     ← Política de privacidad (RGPD)
    ├── cookies.html        ← Política de cookies
    └── terminos.html       ← Términos y condiciones
```

## ✨ Funcionalidades

- **Galería privada**: 6 obras con precios visibles, sin carrito — contacto directo
- **Modo Museo**: recorrer obras a pantalla completa
- **Chat Assistant**: comisaria virtual con respuestas rápidas
- **WhatsApp**: botón flotante de contacto directo
- **🌐 6 idiomas**: selector visible en la barra superior
- **Favoritos ☆**: persistencia en IndexedDB
- **Export/Import**: backup descargable de datos
- **Responsive**: mobile, tablet, desktop
- **SEO**: Open Graph, Schema.org, meta tags

## 🔧 Personalización

1. **WhatsApp**: cambia el número en `index.html` y `obras-disponibles.html`
2. **Email**: cambia el correo en páginas legales
3. **Imágenes reales**: sustituye `assets/obras/*.jpg` por fotos reales
4. **Redes sociales**: cambia las URLs en todos los footers
5. **Precios**: modifícalos en `obras-disponibles.html`

## ⚡ Despliegue

Este sitio es 100% estático. Funciona en cualquier hosting o Vercel/Netlify.

---

© 2026 Yana Yavorskaya. Todos los derechos reservados.