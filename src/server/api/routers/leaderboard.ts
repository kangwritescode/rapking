import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "src/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  getTopUsersByPoints: publicProcedure
    .input(z.object({
      page: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { page } = input;

      const pageSize = 20;
      const skipAmount = page * pageSize;

      const usersWithMostPoints = await ctx.prisma.user.findMany({
        take: pageSize,
        skip: skipAmount,
        orderBy: {
          points: "desc",
        },
      });

      console.log(usersWithMostPoints, "usersWithMostPoints");

      return usersWithMostPoints;

    })
});

