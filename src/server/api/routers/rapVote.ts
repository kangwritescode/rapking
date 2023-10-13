import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "src/server/api/trpc";
import { RapVoteType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, rapId } = input;

      // see if user has already voted on this rap
      const existingVote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId,
            rapId,
          },
        },
      });
      if (existingVote) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already voted on this rap.",
        });
      }

      const vote = await ctx.prisma.rapVote.create({
        data: {
          type: RapVoteType.LIKE,
          userId,
          rapId,
        },
      });

      const rap = await ctx.prisma.rap.update({
        where: {
          id: rapId,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: rap.userId,
        },
        data: {
          points: {
            increment: 1,
          },
        },
      });

      return vote;
    }),
  deleteLike: protectedProcedure
    .input(z.object({
      userId: z.string(),
      rapId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, rapId } = input;

      const vote = await ctx.prisma.rapVote.delete({
        where: {
          userId_rapId: {
            userId,
            rapId,
          },
        },
      });

      if (!vote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You have not voted on this rap.",
        });
      }

      const rap = await ctx.prisma.rap.update({
        where: {
          id: rapId,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: rap.userId,
        },
        data: {
          points: {
            decrement: 1,
          },
        },
      });

      return vote;
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
