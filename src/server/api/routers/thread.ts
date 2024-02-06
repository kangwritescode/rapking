import { z } from 'zod';

import { ThreadComment, User } from '@prisma/client';
import { createTRPCRouter, publicProcedure } from 'src/server/api/trpc';

export type ThreadCommentWithUserData = ThreadComment & {
  user: User;
};

export const threadRouter = createTRPCRouter({
  getThread: publicProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        rapId: z.string().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const { threadId, rapId } = input;

      if (!threadId && !rapId) {
        throw new Error('threadId or rapId required');
      }

      const thread = await ctx.prisma.thread.findFirstOrThrow({
        where: {
          id: threadId,
          rapId: rapId
        }
      });

      return thread;
    }),
  getRapThread: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const rapThread = await ctx.prisma.rapThread.findFirstOrThrow({
        where: {
          id
        },
        include: {
          thread: true
        }
      });

      return rapThread.thread;
    })
});
