import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "src/server/api/trpc";
import { CommentVoteType } from "@prisma/client";

export const commentVoteRouter = createTRPCRouter({
  getCommentLikes: publicProcedure
    .input(z.object({
      commentId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { commentId } = input;

      const rapVotes = await ctx.prisma.commentVote.findMany({
        where: {
          commentId,
          type: CommentVoteType.LIKE,
        },
      });

      return rapVotes;
    }),
  createCommentVote: protectedProcedure
    .input(z.object({
      type: z.enum([CommentVoteType.LIKE]),
      userId: z.string(),
      commentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, commentId, type } = input;

      const commentVote = await ctx.prisma.commentVote.create({
        data: {
          type,
          userId,
          commentId,
        },
      });

      return commentVote;
    }),
  deleteCommentVote: protectedProcedure
    .input(z.object({
      userId: z.string(),
      commentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, commentId } = input;

      const commentVote = await ctx.prisma.commentVote.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      return commentVote;
    }),
});
