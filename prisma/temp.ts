import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateThreads() {
  await prisma.user.updateMany({
    data: {
      reviewRequestTokens: {
        increment: 20
      }
    }
  });
}

migrateThreads()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
