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

export const rapComment = createTRPCRouter({
  getRapComments: publicProcedure
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

      const rapComments = await ctx.prisma.rapComment.findMany({
        where: {
          rapId
        },
        orderBy,
        include: {
          user: true
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (rapComments.length > limit) {
        const nextItem = rapComments.pop();
        nextCursor = nextItem!.id;
      }

      return {
        rapComments,
        nextCursor
      };
    }),
  postComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        userId: z.string(),
        rapId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { content, userId, rapId } = input;

      const rap = await ctx.prisma.rap.findUniqueOrThrow({
        where: {
          id: rapId
        }
      });

      const rateLimitResult = await rateLimit({
        maxRequests: 2,
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

      const rapComment = await ctx.prisma.rapComment.create({
        data: {
          content: sanitizedContent,
          userId,
          rapId
        }
      });

      await ctx.prisma.notification.create({
        data: {
          type: NotificationType.RAP_COMMENT,
          recipientId: rap.userId,
          notifierId: userId,
          commentId: rapComment.id,
          rapId: rap.id
        }
      });

      return rapComment;
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const commentToDelete = await ctx.prisma.rapComment.findUniqueOrThrow({
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

      const deleteResponse = await ctx.prisma.rapComment.delete({
        where: {
          id
        }
      });

      return deleteResponse;
    }),
  getRapCommentsCount: publicProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const count = await ctx.prisma.rapComment.count({
        where: {
          rapId
        }
      });

      return count;
    })
});
