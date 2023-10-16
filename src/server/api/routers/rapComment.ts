import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "src/server/api/trpc";

export const rapComment = createTRPCRouter({
  getRapComments: publicProcedure
    .input(z.object({
      rapId: z.string(),
      sortBy: z.enum(["POPULAR", "RECENT"]),
    }))
    .query(async ({ input, ctx }) => {
      const { rapId, sortBy } = input;

      let orderBy = {};
      if (sortBy === 'RECENT') {
        orderBy = {
          createdAt: 'desc',
        };
      } else if (sortBy === 'POPULAR') {
        orderBy = {
          likesCount: 'desc',
        };
      }


      const rapComments = await ctx.prisma.rapComment.findMany({
        where: {
          rapId,
        },
        orderBy,
        include: {
          user: true,
        },
      });

      return rapComments;
    }),
  postComment: protectedProcedure
    .input(z.object({
      content: z.string(),
      userId: z.string(),
      rapId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { content, userId, rapId } = input;

      const rapComment = await ctx.prisma.rapComment.create({
        data: {
          content,
          userId,
          rapId,
        },
      });

      return rapComment;
    }),
  rapCommentsCount: publicProcedure
    .input(z.object({
      rapId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const count = await ctx.prisma.rapComment.count({
        where: {
          rapId,
        },
      });

      return count;
    }),
  deleteComment: protectedProcedure
    .input(z.object(
      {
        id: z.string(),
      },
    ))
    .mutation(async ({ input, ctx }) => {

      const { id } = input;

      const rapComment = await ctx.prisma.rapComment.delete({
        where: {
          id,
        },
      });

      return rapComment;
    }),
});
