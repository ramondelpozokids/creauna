# Protección de `.env` / `.env.local`

## Orden

**Nadie toca** `.env` ni `.env.local` sin permiso explícito del dueño.

## Dónde está qué

| Qué | Dónde | ¿Secretos? |
|-----|--------|------------|
| Runtime local (Next.js) | `.env.local` | Sí — **gitignored** |
| Stub Prisma | `.env` | No (solo comentario) |
| Plantilla | `env.example` | No |
| Backup con claves | `Desktop\Clave\creauna.env.local.backup*` | Sí — **fuera de GitHub** |
| Orden para agentes | `AGENTS.md`, `.cursor/rules/never-touch-env.mdc` | No — sí en GitHub |

## Por qué no van las API keys a GitHub

Subir `.env.local` a GitHub expone Gemini, OpenAI, Stripe, base de datos, etc. a cualquiera con acceso al repo (y a bots de scraping). El backup **con secretos** vive solo en `Clave` en tu PC (y, si quieres, Vercel / gestor de contraseñas).

## Restaurar

1. Copia desde `Desktop\Clave\creauna.env.local.backup` → `CREAUNA\.env.local`
2. No uses `vercel env pull` a menos que sepas que Vercel tiene **todas** las claves y aceptas sobrescribir.
