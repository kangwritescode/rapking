import { ThreadType } from '@prisma/client';
import { prisma } from 'src/server/db';

export async function createForumThread({
  userId,
  title,
  content
}: {
  userId: string;
  title: string;
  content: string;
}) {
  const result = await prisma.$transaction(async prisma => {
    const thread = await prisma.thread.create({
      data: {
        type: ThreadType.FORUM,
        ownerId: userId,
        commentsCount: 1,
        threadComments: {
          create: {
            content: content,
            userId: userId
          }
        }
      }
    });

    const rapThread = await prisma.forumThread.create({
      data: {
        threadId: thread.id,
        ownerId: thread.ownerId,
        title
      }
    });

    return rapThread;
  });

  return result;
}
