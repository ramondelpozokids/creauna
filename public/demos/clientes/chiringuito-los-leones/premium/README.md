# Capa Premium — Chiringuito Los Leones

Capa **aditiva** que amplía la web sin modificar el diseño aprobado.

## Integración

En `index.html` solo se añaden:

```html
<link rel="stylesheet" href="premium/premium.css">
<script type="module" src="premium/bootstrap.js"></script>
```

Todo el HTML/CSS/JS existente permanece intacto. Los módulos crean nodos `.ll-*` por JavaScript.

## Configuración

Edita [`config.js`](config.js):

| Clave | Uso |
|---|---|
| `ambientAudioUrl` | MP3/OGG de ambiente (olas/mar). Vacío = botón inactivo |
| `aiEndpoint` | API futura del asistente (`POST { message, lang }`) |
| `reserveEndpoint` | Backend reserva inteligente |
| `view360.url` / `type` | Matterport, iframe, imagen 360 o VR |
| `liveKitchen` | `youtube` / `vimeo` / `hls` / `rtsp` |
| `webcam.url` | URL imagen o iframe de webcam |
| `espetosNow` | Imagen/vídeo/live/estado (o `endpoint` JSON) |
| `instagram.embedUrls` | Iframes oficiales (no scrapea) |
| `tiktok.embedUrls` / `profileUrl` | Igual |
| `generationsMedia` | Fotos históricas `g1`…`g4` |
| `features.*` | Activar/desactivar módulos |

## Módulos

- Hero cinema, sonido ambiente, transiciones, detector de idioma (+ IT)
- IA (amplía el chat existente), reserva inteligente, carta interactiva
- Generaciones, experiencia mar (meteo Open-Meteo + sunset + webcam + espetos)
- Vista 360°, recorrido virtual, cocina en directo
- Instagram / TikTok (lazy)
- Panel flotante Experiencias (no altera el nav)

## Rendimiento

ES modules + `import()` dinámico, `IntersectionObserver` para iframes/media, caché de clima en `sessionStorage`.

## Idiomas

ES / EN / FR / DE / IT. El italiano se inyecta en el switcher; **no** traduce automáticamente la carta estática hasta disponer de contenido revisado (solo UI premium en IT).
