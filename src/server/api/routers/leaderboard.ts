import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  getTopUsersByPoints: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
      page: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { limit, page } = input;

        const skipAmount = page * limit;

        const aggregatedData = await ctx.prisma.rapVote.groupBy({
          by: ['userId'],
          _count: {
            _all: true
          },
          where: {
            type: 'LIKE'
          },
          orderBy: {
            _count: {
              type: 'desc'
            }
          },
          skip: skipAmount,
          take: limit
        });

        const userIds = aggregatedData.map(data => data.userId);

        const users = await ctx.prisma.user.findMany({
          where: {
            id: {
              in: userIds
            }
          },
        });

        const result = aggregatedData.map(data => ({
          userData: users.find(user => user.id === data.userId),
          points: data._count._all
        }));

        return result
      })
});

