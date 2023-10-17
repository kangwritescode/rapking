import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "src/server/api/trpc";
import { RapComment, User } from "@prisma/client";

export type RapCommentWithUserData = RapComment & {
  user: User;
};

export const rapComment = createTRPCRouter({
  getRapComments: publicProcedure
    .input(z.object({
      rapId: z.string(),
      sortBy: z.enum(["POPULAR", "RECENT"]),
      page: z.number(),
      pageSize: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const { rapId, sortBy, page, pageSize } = input;

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

      const skip = page * pageSize;

      const rapComments = await ctx.prisma.rapComment.findMany({
        where: {
          rapId,
        },
        orderBy,
        include: {
          user: true,
        },
        skip,
        take: pageSize,
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
  getRapCommentsCount: publicProcedure
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
});
