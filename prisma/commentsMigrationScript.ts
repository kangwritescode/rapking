// Import necessary modules and Prisma client

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRapsToThreads() {
  try {
    // Fetch all Raps
    const raps = await prisma.rap.findMany();

    // Iterate over each Rap
    for (const rap of raps) {
      // Create a Thread for each Rap
      const thread = await prisma.thread.create({
        data: {
          type: 'RAP',
          ownerId: rap.userId,
          rapId: rap.id
        }
      });

      // Copy RapComments to ThreadComments
      const rapComments = await prisma.rapComment.findMany({
        where: { rapId: rap.id }
      });

      for (const rapComment of rapComments) {
        const createdThreadComment = await prisma.threadComment.create({
          data: {
            content: rapComment.content,
            userId: rapComment.userId,
            rapId: rapComment.rapId,
            createdAt: rapComment.createdAt,
            updatedAt: rapComment.updatedAt,
            likesCount: rapComment.likesCount,
            threadId: thread.id
          }
        });

        // Copy RapVotes to ThreadCommentVotes
        const rapVotes = await prisma.commentVote.findMany({
          where: { commentId: rapComment.id }
        });

        for (const rapVote of rapVotes) {
          await prisma.threadCommentVote.create({
            data: {
              type: rapVote.type,
              userId: rapVote.userId,
              threadCommentId: createdThreadComment.id,
              createdAt: rapVote.createdAt
            }
          });
        }
      }
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
migrateRapsToThreads();
