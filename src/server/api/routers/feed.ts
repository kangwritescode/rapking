import { z } from 'zod';

import { Country, Rap, RapStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from 'src/server/api/trpc';
import { shuffleArray } from 'src/shared/utils';

// Schemas
const createRapPayloadSchema = z.object({
  title: z.string(),
  content: z.string()
});
const updateRapPayloadSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtUrl: z.string().optional().nullable()
});

const sortBySchema = z.enum(['NEWEST', 'TOP']);
const timeFilterSchema = z.enum(['ALL', '24HOURS', '7DAYS', '30DAYS', '6MONTHS', '12MONTHS']);
const countryFilterSchema = z.union([z.literal('ALL'), z.nativeEnum(Country)]);
const sexFilterSchema = z.enum(['ANY', 'MALE', 'FEMALE']);

// Types
export type CreateRapPayload = z.infer<typeof createRapPayloadSchema>;
export type UpdateRapPayload = z.infer<typeof updateRapPayloadSchema>;

export type SortByValue = z.infer<typeof sortBySchema>;
export type TimeFilter = z.infer<typeof timeFilterSchema>;
export type CountryFilter = z.infer<typeof countryFilterSchema>;
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
    .input(
      z.object({
        sortBy: sortBySchema,
        countryFilter: countryFilterSchema,
        timeFilter: timeFilterSchema,
        followingFilter: z.boolean().optional(),
        sexFilter: sexFilterSchema,
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(50)
      })
    )
    .query(async ({ ctx, input }) => {
      const { sortBy, countryFilter, timeFilter, followingFilter, sexFilter, cursor, limit } =
        input;

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
      const where: any = {
        status: RapStatus.PUBLISHED
      };

      if (countryFilter !== 'ALL') {
        where.user = { country: countryFilter };
      }

      if (sexFilter !== 'ANY') {
        where.user = {
          ...where.user,
          sex: sexFilter === 'MALE' ? 'male' : 'female'
        };
      }

      const filterDate = getTimeFilterDate(timeFilter);
      if (filterDate) {
        where.dateCreated = { gte: filterDate };
      }

      if (followingFilter) {
        // Handle for when user is not logged in
        if (!ctx.session) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You must be logged in to use this filter.'
          });
        }
        const userId = ctx.session.user.id;
        const followedUsers = await ctx.prisma.userFollows.findMany({
          where: { followerId: userId },
          select: { followedId: true }
        });

        const followedUserIds = followedUsers.map(follow => follow.followedId);
        where.userId = { in: followedUserIds };
      }

      const raps = await ctx.prisma.rap.findMany({
        where,
        orderBy,
        include: {
          user: {
            select: {
              username: true,
              profileImageUrl: true,
              country: true
            }
          },
          collaborators: {
            select: {
              id: true,
              username: true
            }
          },
          promotions: {
            select: {
              endsAt: true,
              startedAt: true
            }
          }
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1
      });

      const now = new Date();
      const promotedRaps: Array<Rap> = [];
      const nonPromotedRaps: Array<Rap> = [];

      // Separate raps into promoted and non-promoted
      raps.forEach(rap => {
        const isPromoActive = rap.promotions.some(
          promo => promo.startedAt <= now && promo.endsAt >= now
        );
        if (isPromoActive) {
          promotedRaps.push(rap);
        } else {
          nonPromotedRaps.push(rap);
        }
      });

      // Shuffle only the promoted raps
      shuffleArray(promotedRaps);

      // Concatenate the shuffled promoted raps with the non-promoted raps
      const sortedAndShuffledRaps = [...promotedRaps, ...nonPromotedRaps] as typeof raps;

      let nextCursor: typeof cursor | undefined = undefined;
      if (raps.length > limit) {
        const nextItem = raps.pop();
        nextCursor = nextItem!.id;
      }

      return { raps: sortedAndShuffledRaps, nextCursor };
    })
});
