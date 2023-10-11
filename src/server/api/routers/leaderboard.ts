import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "src/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  getTopUsersByPoints: publicProcedure
    .input(z.object({
      page: z.number().default(1),
    }))
    .query(async ({ input, ctx }) => {
      const { page } = input;

      const pageSize = 20;
      const skipAmount = page * pageSize;

      const aggregatedData = await ctx.prisma.rap.groupBy({
        by: ['userId'],
        _sum: {
          likesCount: true,
        },
        orderBy: {
          _sum: {
            likesCount: 'desc',
          }
        },
        skip: skipAmount,
        take: pageSize,
      })

      const userIds = aggregatedData.map((data) => data.userId);

      const users = await ctx.prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          }
        }
      });

      const usersAndTheirPoints = aggregatedData.map((data) => {
        const user = users.find((user) => user.id === data.userId);

        return {
          user,
          points: data._sum.likesCount,
        }
      });


      return usersAndTheirPoints;
    })
});

