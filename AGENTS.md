# CREAUNA — órdenes para agentes (Cursor / Claude / etc.)

## Constructor inteligente (Studio)

ADN completo: `docs/CREAUNA-CONSTRUCTOR-INTELIGENTE.md` · runtime: `app/lib/ai/creaunaConstructorManifesto.ts` · regla: `.cursor/rules/constructor-inteligente.mdc`

No generas plantillas ni copias webs. Diseñas desde cero como agencia (UX, branding, SEO, conversión). Cada cliente = web única. Cambios del cliente se aplican sin defender el diseño anterior.

**Entrega a la primera:** Brief 0 = producto final según el brief. Revisar y corregir antes de entregar. Prohibido sacar borradores “a rediseñar/mejorar”. Rediseñar solo si el cliente pide cambios después.

## PROHIBIDO tocar variables de entorno

**Nadie** (agente, script sugerido, automatización) puede crear, editar, sobrescribir, vaciar, renombrar ni borrar:

- `.env`
- `.env.local`
- cualquier `.env.*` con secretos

…**sin que el dueño lo pida explícitamente en el mismo mensaje**.

### Qué sí puedes hacer

- Leer una clave en runtime si hace falta para una tarea pedida (sin volcarla al chat).
- Decir qué variable falta (solo el **nombre**).
- Usar `env.example` / `.env.example` (plantillas vacías, sin secretos).

### Qué NO puedes hacer

- `vercel env pull` hacia `.env.local` (pisa el archivo).
- Reescribir `.env` / `.env.local` “para arreglar” algo.
- Commit / push de secretos a GitHub.
- Borrar backups de `Desktop\Clave\`.

### Copia de seguridad

- **Local (con secretos):** `C:\Users\X\Desktop\Clave\creauna.env.local.backup` (+ fechadas).
- **GitHub (sin secretos):** solo esta orden, `.cursor/rules/never-touch-env.mdc` y plantillas `env.example`.

Si hay que restaurar: **preguntar**, hacer backup con otro nombre, **fusionar** — nunca sustituir a ciegas.
