import { prisma } from 'src/server/db';

export async function createWall(ownerId: string) {
  const result = await prisma.$transaction(async prisma => {
    const thread = await prisma.thread.create({
      data: {
        type: 'WALL',
        ownerId: ownerId
      }
    });

    // Step 2: Create a Wall with the new Thread's ID
    const wall = await prisma.wall.create({
      data: {
        threadId: thread.id,
        ownerId: ownerId
      }
    });

    return wall;
  });

  return result;
}
