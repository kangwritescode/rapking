import sanitize from 'sanitize-html';
import { z } from 'zod';

import { NotificationType, ThreadComment, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { containsBannedWords } from 'src/shared/bannedWords';

export type ThreadCommentWithUserData = ThreadComment & {
  user: User;
};

export const threadComments = createTRPCRouter({
  getThreadComments: publicProcedure
    .input(
      z.object({
        threadId: z.string(),
        sortBy: z.enum(['POPULAR', 'RECENT']),
        limit: z.number(),
        cursor: z.string().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const { threadId, sortBy, cursor, limit } = input;

      let orderBy = {};
      if (sortBy === 'RECENT') {
        orderBy = {
          createdAt: 'desc'
        };
      } else if (sortBy === 'POPULAR') {
        orderBy = [{ likesCount: 'desc' }, { id: 'asc' }];
      }

      const threadComments = await ctx.prisma.threadComment.findMany({
        where: {
          threadId
        },
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true
            }
          }
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (threadComments.length > limit) {
        const nextItem = threadComments.pop();
        nextCursor = nextItem!.id;
      }

      return {
        threadComments,
        nextCursor
      };
    }),
  postThreadComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        threadId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { content, threadId } = input;

      const userId = ctx.session.user.id;

      const thread = await ctx.prisma.thread.findFirstOrThrow({
        where: {
          id: threadId
        }
      });

      const rateLimitResult = await rateLimit({
        maxRequests: 3,
        window: 60 * 60,
        keyString: `threadComment-${threadId}-${userId}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / 60);
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You are doing that too much. Please try again in ${resetTime} minutes.`
        });
      }

      const sanitizedContent = sanitize(content, {
        allowedTags: ['br', 'b', 'strong', 'i'],
        allowedAttributes: {}
      });

      if (containsBannedWords(sanitizedContent)) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later'
        });
      }

      const threadComment = await ctx.prisma.threadComment.create({
        data: {
          content: sanitizedContent,
          userId,
          threadId: thread.id
        }
      });

      if (thread.type === 'RAP' && thread.ownerId !== userId) {
        await ctx.prisma.notification.create({
          data: {
            type: NotificationType.RAP_COMMENT,
            recipientId: thread.ownerId,
            notifierId: userId,
            threadCommentId: threadComment.id,
            rapId: thread.rapId
          }
        });
      }

      if (thread.type === 'WALL' && thread.ownerId !== userId) {
        await ctx.prisma.notification.create({
          data: {
            type: NotificationType.WALL_COMMENT,
            recipientId: thread.ownerId,
            notifierId: userId,
            threadCommentId: threadComment.id
          }
        });
      }

      return threadComment;
    }),
  deleteThreadComment: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const commentToDelete = await ctx.prisma.threadComment.findUniqueOrThrow({
        where: {
          id
        }
      });

      if (commentToDelete.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "You don't have permission to do that."
        });
      }

      const deleteResponse = await ctx.prisma.threadComment.delete({
        where: {
          id
        }
      });

      return deleteResponse;
    }),
  getThreadCommentsCount: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const count = await ctx.prisma.threadComment.count({
        where: {
          threadId: id
        }
      });

      return count;
    })
});
