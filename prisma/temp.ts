import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateThreads() {
  // Find all threads with type "RAP"
  const rapThreads = await prisma.thread.findMany({
    where: {
      type: 'RAP'
    },
    include: {
      rap: true // Assuming a relation is defined in Thread model for rap
    }
  });

  // For each RAP thread, create a RapThread
  for (const thread of rapThreads) {
    if (thread.rap) {
      await prisma.rapThread.create({
        data: {
          threadId: thread.id,
          rapId: thread.rap.id,
          ownerId: thread.rap.userId
        }
      });
    }
  }

  // Find all threads with type "WALL"
  const wallThreads = await prisma.thread.findMany({
    where: {
      type: 'WALL'
    },
    include: {
      owner: true // Assuming a relation is defined in Thread model for owner
    }
  });

  // For each WALL thread, create a Wall
  for (const thread of wallThreads) {
    await prisma.wall.create({
      data: {
        threadId: thread.id,
        ownerId: thread.ownerId
      }
    });
  }

  console.log('Migration completed successfully.');
}

migrateThreads()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
