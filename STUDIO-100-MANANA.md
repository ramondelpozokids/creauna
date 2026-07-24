# Studio — estado 24 jul 2026 (sesión techo visual)

Programa 100/100 activo. Gates automáticos ≠ ojo humano: el juez ya no infla.

## Nivel / porcentaje

| Capa | ~% | Notas |
|------|----|--------|
| Arquitectura Director Creativo | **~92%** | LLM primario OK. |
| Gates automáticos (rúbrica) | **media 94 / min 92.1** | Benchmark `2026-07-24T07-37-37-627Z` — honesta; freeze **no** levantado (falta avg≥95). |
| Comprensión de brief | **~90%** | Aura OK con LLM. |
| Calidad visual vs demos | **~80–84%** | Heroes 88–96vh, craft chrome, nav por `navId`, carta/menu rows, overlays DNA. |
| Objetivo “100/100 agencia” | **~82–84%** | Aura smoke **92.1/100** craft + luxury palette. Siguiente: +1–2 pts craft asimétrico. |

## Hecho esta sesión

1. Techo visual en `constrainedRenderer` + `designDna` (clinic/restaurant craft).
2. `rubricJudge`: señales craft/inmersión; **eliminado** inflate a 93.
3. Nav HTML real por `nav-minimal-link` / `nav-hospitality-book` / `nav-sticky-dark` / corporate.
4. Servicios menú-led cuando card/sector gastronómico.
5. Demo Leones HTML cerrado (carta visible) — deploy `8d55357`.

## Siguiente

1. `npm run verify:creative` + `npm run smoke:aura` — comparar HTML vs Tarik / El Paso / Leones.
2. `npm run benchmark:agency-100` — nueva media honesta (puede bajar vs 97; eso es bueno).
3. Más familias hero asimétricas en renderer (no solo metadata).
4. Feature freeze producto nuevo: mantener.

## Prohibido

- Parches regex por cliente
- Caps globales de plantilla
- Clonar demos
- Volver a inflar el juez

## Doc

[docs/CREAUNA-STUDIO-100.md](docs/CREAUNA-STUDIO-100.md) · runtime `app/lib/ai/creative/`
