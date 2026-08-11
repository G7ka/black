import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'bibmarley843@gmail.com';
  const existing = await prisma.platformAdmin.findUnique({ where: { email } });

  if (existing) {
    console.log('Seed: super admin already exists, skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  await prisma.platformAdmin.create({
    data: {
      name: 'Admin Platform',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`Seed: created super admin ${email} / ChangeMe123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
