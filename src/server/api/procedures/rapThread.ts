import { Rap } from '@prisma/client';
import { prisma } from 'src/server/db';

export async function createRapThread(rap: Rap) {
  const result = await prisma.$transaction(async prisma => {
    const thread = await prisma.thread.create({
      data: {
        type: 'WALL',
        ownerId: rap.userId
      }
    });

    // Step 2: Create a Wall with the new Thread's ID
    const rapThread = await prisma.rapThread.create({
      data: {
        threadId: thread.id,
        ownerId: thread.ownerId,
        rapId: rap.id
      }
    });

    return rapThread;
  });

  return result;
}
