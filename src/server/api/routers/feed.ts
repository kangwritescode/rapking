import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "src/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Schemas
const createRapPayloadSchema = z.object({
  title: z.string(),
  content: z.string(),
});
const updateRapPayloadSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  coverArtUrl: z.string().optional().nullable(),
});

const sortBySchema = z.enum(["NEWEST", "TOP"]);
const timeFilterSchema = z.enum(["ALL", "24HOURS", "7DAYS", "30DAYS", "6MONTHS", "12MONTHS"]);
const regionFilterSchema = z.enum(["ALL", "WEST", "MIDWEST", "EAST", "SOUTH"]);
const sexFilterSchema = z.enum(['ANY', 'MALE', 'FEMALE']);

// Types
export type CreateRapPayload = z.infer<typeof createRapPayloadSchema>;
export type UpdateRapPayload = z.infer<typeof updateRapPayloadSchema>;

export type SortByValue = z.infer<typeof sortBySchema>;
export type TimeFilter = z.infer<typeof timeFilterSchema>;
export type RegionFilter = z.infer<typeof regionFilterSchema>;
export type SexFilter = z.infer<typeof sexFilterSchema>;

// Utils
function getTimeFilterDate(timeFilter: TimeFilter) {
  const filterDate = new Date();

  switch (timeFilter) {
    case '24HOURS':
      filterDate.setDate(filterDate.getDate() - 1);
      break;
    case '7DAYS':
      filterDate.setDate(filterDate.getDate() - 7);
      break;
    case '30DAYS':
      filterDate.setDate(filterDate.getDate() - 30);
      break;
    case '6MONTHS':
      filterDate.setMonth(filterDate.getMonth() - 6);
      break;
    case '12MONTHS':
      filterDate.setMonth(filterDate.getMonth() - 12);
      break;
    default:
      return null;
  }

  return filterDate;
}

export const feedRouter = createTRPCRouter({
  queryRaps: publicProcedure
    .input(z.object({
      sortBy: sortBySchema,
      regionFilter: regionFilterSchema,
      timeFilter: timeFilterSchema,
      followingFilter: z.boolean().optional(),
      sexFilter: sexFilterSchema,
      page: z.number(),
      pageSize: z.number(),
    }))
    .query(async ({ ctx, input }) => {

      const {
        sortBy,
        regionFilter,
        timeFilter,
        followingFilter,
        sexFilter,
        page,
        pageSize,
      } = input;

      // Sort logic
      let orderBy: any;
      switch (sortBy) {
        case 'NEWEST':
          orderBy = { dateCreated: 'desc' };
          break;
        case 'TOP':
          orderBy = { upvotes: 'desc' };
          break;
        default:
          orderBy = {};
      }

      // Filter logic
      const where: any = {};

      if (regionFilter !== 'ALL') {
        where.user = { region: regionFilter };
      }

      if (sexFilter !== 'ANY') {
        where.user = {
          ...where.user,
          sex: sexFilter === 'MALE' ? 'male' : 'female'
        }
      }

      const filterDate = getTimeFilterDate(timeFilter);
      if (filterDate) {
        where.dateCreated = { gte: filterDate };
      }

      if (followingFilter) {
        // Handle for when user is not logged in
        if (!ctx.session) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You must be logged in to use this filter.",
          });
        }
        const userId = ctx.session.user.id;
        const followedUsers = await ctx.prisma.userFollows.findMany({
          where: { followerId: userId },
          select: { followedId: true },
        });

        const followedUserIds = followedUsers.map(follow => follow.followedId);
        where.userId = { in: followedUserIds };
      }

      const skip = page * pageSize;

      const raps = await ctx.prisma.rap.findMany({
        where,
        orderBy,
        include: {
          user: true,
        },
        skip,
        take: pageSize,
      });

      const rapsCount = await ctx.prisma.rap.count({ where });

      return { rapsData: raps, rapsCount };
    }),
});
