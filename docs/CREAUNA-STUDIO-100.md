# CREAUNA Studio — Objetivo 100/100 (Director Creativo)

**Versión del contrato:** 1.0.0  
**Fecha:** 20 jul 2026  
**Estado:** programa activo — feature freeze de producto nuevo hasta media ≥95 y mínimo ≥90 en benchmark.

## Principio

Studio no construye primero. Razona. Decide. Compone. Renderiza bajo contrato. Se juzga. Solo entonces entrega.

Pregunta permanente: *¿Esto acerca CREAUNA a superar el trabajo de una agencia profesional?*  
Si solo reduce errores del suelo → cola técnica mínima, fuera del programa 100/100.

## Pipeline objetivo

1. Creative Director → `CreativeBrief` JSON  
2. `resolveDesignDna`  
3. Composition Engine (layout + componentes + seed)  
4. Constrained Renderer  
5. Technical Guarantees (imágenes, legales, a11y, sin extras no pedidos)  
6. Rubric Judge híbrido → revisión creativa si &lt;90  

## Feature freeze

Hasta media ≥95 y ninguna generación &lt;90 en `scripts/benchmark-agency-100.ts`:

- No nuevas features de producto en Studio  
- No parches estéticos globales (hero 70vh forzado, grids 3 cols universales, Playfair+Inter por defecto)  
- Deprecado como producto estético: `buildDeterministicAgencyHtml` shell completo  

## Rúbrica (pesos = 100)

Ver `app/lib/ai/creative/rubric.ts` (fuente de verdad versionada).

## Benchmark (5 briefs)

1. Clínica dental premium Madrid  
2. Restaurante italiano  
3. Abogados mercantiles  
4. Hotel boutique  
5. Agencia de arquitectura  

```bash
npx tsx scripts/benchmark-agency-100.ts
```

Salida: `tmp/benchmark/<runId>/` + `scorecard.json`.

## Deprecaciones graduales

| Artefacto | Destino |
|-----------|---------|
| Shell determinista como estética | Scaffold técnico o eliminación |
| `polishHeroHtml` global | Solo fixes técnicos |
| Forzado `md:grid-cols-3` global | Ritmo por DNA/layout |
| Fake redesign Tailwind swap | Fuera del path creativo |
| `VARIANT_DESIGN` anclado a demos | DNA + library |

## Reutilizable

Hechos del brief, `IMAGE_BANK` como pool, chrome legales/WA gate, demos como techo (no clones), manifesto en el Director.

**Estado del freeze:** el benchmark local puede levantar el freeze cuando `passedAvg95 && passedMin90` en `scorecard.json`. Re-ejecutar:

```bash
npm run benchmark:agency-100
npx tsx scripts/verify-creative-director.ts
```
