# CREAUNA — Ultra Premium 2026

**El constructor de webs con IA más refinado del mundo.**  
Diseño de estudio de alto standing. Todo en español (con toggle ES/EN).

---

## 🚀 Cómo verlo en LOCAL (Windows)

### 1. Requisitos
- Node.js 20+ instalado (https://nodejs.org)
- Tu carpeta del proyecto en:  
  `C:\Users\X\Desktop\CREAUNA`

### 2. Archivos importantes que ya debes tener

Asegúrate de tener esta carpeta con **las 7 imágenes**:

```
C:\Users\X\Desktop\CREAUNA\public\images\
```

Contenido esperado:
- `luxury-jewelry-atelier-elegant-interior--1.jpg`
- `luxury-jewelry-atelier-elegant-interior--2.jpg`
- `luxury-jewelry-atelier-elegant-interior--3.jpg`
- `modern-architecture-minimalist-building--1.jpg`
- `modern-architecture-minimalist-building--2.jpg`
- `fine-dining-restaurant-interior-elegant--1.jpg`
- `fine-dining-restaurant-interior-elegant--2.jpg`

### 3. Ejecutar el proyecto (método fácil)

#### Opción A — Con doble clic (recomendado)

1. Abre la carpeta del proyecto en el Explorador.
2. Haz doble clic en **`start-local.bat`**

#### Opción B — Con PowerShell / Terminal

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm install
npm run dev
```

Abre en el navegador:
**http://localhost:3000**

---

## Páginas principales para probar

- `/` → Landing espectacular
- `/dashboard` → **Dashboard ultra-premium** (lo más importante)
- `/studio` → Studio con IA
- `/templates` → Plantillas con imágenes reales
- `/precios` → Precios con visual premium
- `/modernizacion` → Modernización + Before & After
- `/web-a-medida` → Servicio premium
- `/login` y `/signup`

---

## Características actuales (nivel más alto)

- Dashboard completamente premium (el que pediste)
- Todas las imágenes son locales (sin Unsplash)
- Logo real en Navbar, Footer, Chat, Login, Studio, Dashboard, Superadmin
- Diseño de alto standing en todo el sitio
- Todo en español
- Build limpio y optimizado

---

## Deploy en Vercel

1. Crea una base **PostgreSQL** gratuita en [Neon](https://neon.tech) o Supabase.
2. En `prisma/schema.prisma`, cambia `provider = "sqlite"` por `provider = "postgresql"`.
3. En Vercel → **Environment Variables**, añade:
   - `DATABASE_URL` (URL Postgres)
   - `CREAUNA_AUTH_SECRET` (cadena aleatoria larga)
   - `CREAUNA_ADMIN_EMAIL=info@ramondelpozorott.es`
   - `CREAUNA_DEMO_AUTH=false`
   - `VERCEL_PREVIEW_FEEDBACK_ENABLED=0`
   - Claves IA que uses (`GEMINI_API_KEY`, etc.)
4. Tras el primer deploy, ejecuta una vez: `npx prisma db push` contra la URL de producción (o inclúyelo en el build).
5. Push a `main` → Vercel despliega automáticamente.

---

## Comandos útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run db:push      # Sincronizar esquema Prisma (local)
npm run db:migrate   # Migraciones en desarrollo
```

---

## Notas

- Las imágenes están en `public/images/` (deben estar en tu máquina)
- El proyecto usa Next.js 16 + Tailwind
- El dashboard está centrado con `max-w-7xl` y nivel de lujo muy alto

---

**Fundado por Ramón del Pozo Rott**  
CREAUNA 2026

---

¿Quieres que añada más imágenes o eleve alguna sección concreta? Dímelo.