// Import necessary modules and Prisma client

import { PrismaClient, ThreadType } from '@prisma/client';

const prisma = new PrismaClient();

async function createThreadsPerUser() {
  try {
    // Fetch all Raps
    const users = await prisma.user.findMany();

    // create Thread for each user
    for (const user of users) {
      await prisma.thread.create({
        data: {
          ownerId: user.id,
          type: ThreadType.WALL
        }
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}

// Run the migration
createThreadsPerUser();
