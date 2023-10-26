import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { NotificationType, RapComment, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';

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

      const rap = await ctx.prisma.rap.findUnique({
        where: {
          id: rapId
        }
      });

      if (!rap) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Rap doesn't exist"
        });
      }

      const rapComment = await ctx.prisma.rapComment.create({
        data: {
          content,
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

      const rapComment = await ctx.prisma.rapComment.delete({
        where: {
          id
        }
      });

      return rapComment;
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
