import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "src/server/api/trpc";
import { RapVoteType } from "@prisma/client";

export const vote = createTRPCRouter({
  getRapVotes: publicProcedure
    .input(z.object({
      followerId: z.string(),
      followedId: z.string(),
    }))
    .query(async ({ input, ctx }) => {

      const { followerId, followedId } = input;

      const follow = await ctx.prisma.userFollows.findUnique({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });

      return follow;
    }),
  createRapVote: protectedProcedure
    .input(z.object({
      type: z.enum([RapVoteType.LIKE]),
      userId: z.string(),
      rapId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, rapId, type } = input;

      const follow = await ctx.prisma.rapVote.create({
        data: {
          type,
          userId,
          rapId,
        },
      });

      return follow;
    }),
  deleteRapVoteByUser: protectedProcedure
    .input(z.object({
      userId: z.string(),
      rapId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { userId, rapId } = input;

      const follow = await ctx.prisma.rapVote.delete({
        where: {
          userId_rapId: {
            userId,
            rapId,
          },
        },
      });

      return follow;
    }),
});
