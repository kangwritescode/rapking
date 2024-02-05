import sanitize from 'sanitize-html';
import { z } from 'zod';

import { NotificationType, RapComment, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { containsBannedWords } from 'src/shared/bannedWords';

export type RapCommentWithUserData = RapComment & {
  user: User;
};

export const threadComments = createTRPCRouter({
  getThreadComments: publicProcedure
    .input(
      z.object({
        rapId: z.string(),
        sortBy: z.enum(['POPULAR', 'RECENT']),
        limit: z.number(),
        cursor: z.string().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const { rapId, sortBy, cursor, limit } = input;

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
          rapId
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
        userId: z.string(),
        rapId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { content, userId, rapId } = input;

      const rapThread = await ctx.prisma.thread.findFirstOrThrow({
        where: {
          rapId
        }
      });

      const rateLimitResult = await rateLimit({
        maxRequests: 3,
        window: 60 * 60,
        keyString: `rapComment-${rapId}-${userId}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / 60); // Convert to minutes
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

      const rapComment = await ctx.prisma.threadComment.create({
        data: {
          content: sanitizedContent,
          userId,
          rapId,
          threadId: rapThread.id
        }
      });

      await ctx.prisma.notification.create({
        data: {
          type: NotificationType.RAP_COMMENT,
          recipientId: rapThread.ownerId,
          notifierId: userId,
          threadCommentId: rapComment.id,
          rapId: rapThread.rapId
        }
      });

      return rapComment;
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
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const count = await ctx.prisma.threadComment.count({
        where: {
          rapId
        }
      });

      return count;
    })
});
