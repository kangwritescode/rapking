import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "src/server/api/trpc";
import { RapVoteType } from "@prisma/client";

export const rapVote = createTRPCRouter({
  getRapLikes: publicProcedure
    .input(z.object({
      rapId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const rapVotes = await ctx.prisma.rapVote.findMany({
        where: {
          rapId,
          type: RapVoteType.LIKE,
        },
      });

      return rapVotes;
    }),
  createLike: protectedProcedure
    .input(z.object({
      userId: z.string(),
      rapId: z.string(),
      authorId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, rapId, authorId } = input;

      // Check if vote exists
      const vote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId,
            rapId,
          },
        },
      });

      if (vote) {
        throw new Error("Vote already exists");
      }

      // Start transaction for creating vote and updating rap and user points
      const [createdVote, rap] = await ctx.prisma.$transaction([
        ctx.prisma.rapVote.create({
          data: {
            type: RapVoteType.LIKE,
            userId,
            rapId,
          },
        }),
        ctx.prisma.rap.update({
          where: {
            id: rapId,
          },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        }),
        ctx.prisma.user.update({
          where: {
            id: authorId,
          },
          data: {
            points: {
              increment: 1,
            },
          },
        })
      ])

      return {createdVote, rapLikesCount: rap.likesCount};
    }),
  deleteLike: protectedProcedure
    .input(z.object({
      userId: z.string(),
      rapId: z.string(),
      authorId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, rapId, authorId } = input;

      // Check if vote exists
      const vote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId,
            rapId,
          },
        },
      });

      if (!vote) {
        throw new Error("Vote does not exist");
      }

      const [deletedVote, updatedRap] = await ctx.prisma.$transaction([
        ctx.prisma.rapVote.delete({
          where: {
            userId_rapId: {
              userId,
              rapId,
            },
          },
        }),
        ctx.prisma.rap.update({
          where: {
            id: rapId,
          },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        }),
        ctx.prisma.user.update({
          where: {
            id: authorId,
          },
          data: {
            points: {
              decrement: 1,
            },
          },
        })
      ]);

      return {deletedVote, rapLikesCount: updatedRap.likesCount};
    }),
  likeExists: publicProcedure
    .input(z.object({
      userId: z.string(),
      rapId: z.string(),
    }))
    .query(async ({ input, ctx }) => {

      const { userId, rapId } = input;

      const vote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId,
            rapId,
          },
        },
      });

      return !!vote;
    }),
});
