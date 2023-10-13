import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "src/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  getTopUsersByPoints: publicProcedure
    .input(z.object({
      page: z.number().default(0),
      pageSize: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input;

      const skipAmount = page * pageSize;

      const rowData = await ctx.prisma.user.findMany({
        take: pageSize,
        skip: skipAmount,
        orderBy: {
          points: "desc",
        },
      });

      // Fetch the total count of users
      const usersWithPoints = await ctx.prisma.user.count();

      return {
        rowData,
        rowCount: usersWithPoints,
      }
    })
});

