import { Rap, ThreadType } from '@prisma/client';
import { prisma } from 'src/server/db';

export async function createRapThread(rap: Rap) {
  const result = await prisma.$transaction(async prisma => {
    const thread = await prisma.thread.create({
      data: {
        type: ThreadType.RAP,
        ownerId: rap.userId,
        rapId: rap.id
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
