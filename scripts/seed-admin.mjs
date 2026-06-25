/**
 * Crea o actualiza la cuenta superadmin.
 * Uso: CREAUNA_ADMIN_PASSWORD=tu_clave npm run seed:admin
 * (con DATABASE_URL en .env.local o entorno)
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.CREAUNA_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.CREAUNA_ADMIN_PASSWORD?.trim();
  const name = process.env.CREAUNA_ADMIN_NAME?.trim() || 'Ramón del Pozo';

  if (!email) {
    console.error('Falta CREAUNA_ADMIN_EMAIL');
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error('Falta CREAUNA_ADMIN_PASSWORD (mínimo 8 caracteres)');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      credits: 15,
      role: 'admin',
    },
    update: {
      name,
      passwordHash,
      role: 'admin',
    },
  });

  console.log(`Superadmin listo: ${user.email} (rol: ${user.role})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
