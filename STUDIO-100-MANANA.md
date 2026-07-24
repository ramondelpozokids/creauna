# Studio — estado 24 jul 2026 (gates 95/90)

## Nivel

| Capa | ~% | Notas |
|------|----|--------|
| Director Creativo LLM | **~92%** | Primario OK. |
| Gates benchmark | **media 95.3 / min 95.1** | `2026-07-24T07-54-07-007Z` — **feature freeze levantado**. |
| Comprensión | **100%** en benchmark | Aura OK. |
| Visual vs demos | **~84–88%** | Heroes asimétricos ≥90vh, craft, `<main>`, nav por id. |
| Objetivo 100 agencia | **~88%** | Gates OK; seguir techo percibido (ojo vs Tarik/Leones). |

## Hecho

1. Commit `4d45bb6` techo visual + juez sin inflate.
2. Heroes asimétricos / editorial / bleed más inmersivos.
3. Fix juez: forbidden visuals no matchean `hero-saas` / `nav-corporate`.
4. `<main>` + filtro hero-saas en verticales craft.
5. Benchmark gates **passedAvg95 + passedMin90** → freeze lifted.

## Siguiente (percibido → 100)

1. Revisar a ojo Aura vs demos techo.
2. Más ritmo de sección (galería/about) al nivel Leones.
3. No re-inflar el juez.

## Comandos

```bash
npm run verify:creative
npm run smoke:aura
npm run benchmark:agency-100
```
