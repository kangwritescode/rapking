import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from 'src/server/api/trpc';

const timeFilterSchema = z.enum(['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR', 'ALL_TIME']);
const countryFilterSchema = z.enum(['ALL', 'US', 'UK', 'CA']);
const sexFilterSchema = z.enum(['ANY', 'MALE', 'FEMALE']);

export type LeaderboardTimeFilter = z.infer<typeof timeFilterSchema>;
export type LeaderboardCountryFilter = z.infer<typeof countryFilterSchema>;
export type LeaderboardSexFilter = z.infer<typeof sexFilterSchema>;

// Utils
function getTimeFilterDate(timeFilter: LeaderboardTimeFilter) {
  const filterDate = new Date();

  // Reset hours, minutes, seconds, and milliseconds to zero
  filterDate.setHours(0, 0, 0, 0);

  switch (timeFilter) {
    case 'TODAY':
      // The date is already set to today at 12:00 AM
      break;
    case 'THIS_WEEK':
      // Set to the start of the current week (assuming the week starts on Sunday)
      filterDate.setDate(filterDate.getDate() - filterDate.getDay());
      break;
    case 'THIS_MONTH':
      // Set to the first day of the current month
      filterDate.setDate(1);
      break;
    case 'THIS_YEAR':
      // Set to the first day of the current year
      filterDate.setMonth(0, 1);
      break;
    case 'ALL_TIME':
      // Return null or an early date to represent all time
      return null;
  }

  return filterDate;
}

export const leaderboardRouter = createTRPCRouter({
  getTopUsersByPoints: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(50),
        timeFilter: timeFilterSchema,
        countryFilter: countryFilterSchema,
        sexFilter: sexFilterSchema
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, countryFilter, sexFilter, timeFilter } = input;

      // Filter logic
      const where: any = {};

      if (countryFilter !== 'ALL') {
        where.country = {
          equals: countryFilter,
          not: null // filter out users with incomplete profiles
        };
      }

      if (sexFilter !== 'ANY') {
        where.sex = sexFilter === 'MALE' ? 'male' : 'female';
      }

      const filterDate = getTimeFilterDate(timeFilter);
      if (filterDate) {
        where.createdAt = { gte: filterDate };
      }

      const users = await ctx.prisma.user.findMany({
        orderBy: {
          points: 'desc'
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        where,
        select: {
          id: true,
          username: true,
          points: true,
          profileImageUrl: true
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor
      };
    })
});
