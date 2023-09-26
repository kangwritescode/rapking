import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "src/server/api/trpc";

export const userFollows = createTRPCRouter({
  getFollow: publicProcedure
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
  createFollow: protectedProcedure
    .input(z.object({
      followerId: z.string(),
      followedId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { followerId, followedId } = input;

      const follow = await ctx.prisma.userFollows.create({
        data: {
          followerId,
          followedId,
        },
      });

      return follow;
    }),
  deleteFollow: protectedProcedure
    .input(z.object({
      followerId: z.string(),
      followedId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const { followerId, followedId } = input;

      const follow = await ctx.prisma.userFollows.delete({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });

      return follow;
    }),
});
