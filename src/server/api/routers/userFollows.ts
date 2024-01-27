import { z } from 'zod';

import { NotificationType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

export const userFollows = createTRPCRouter({
  getFollow: publicProcedure
    .input(
      z.object({
        followerId: z.string(),
        followedId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { followerId, followedId } = input;

      const follow = await ctx.prisma.userFollows.findUnique({
        where: {
          followerId_followedId: {
            followerId,
            followedId
          }
        }
      });

      return follow;
    }),
  createFollow: protectedProcedure
    .input(
      z.object({
        followerId: z.string(),
        followedId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to follow a user.'
        });
      }

      const { followerId, followedId } = input;

      const follow = await ctx.prisma.userFollows.create({
        data: {
          followerId,
          followedId
        }
      });

      await ctx.prisma.notification.create({
        data: {
          type: NotificationType.FOLLOW,
          recipientId: followedId,
          notifierId: followerId
        }
      });

      return follow;
    }),
  deleteFollow: protectedProcedure
    .input(
      z.object({
        followerId: z.string(),
        followedId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to unfollow a user.'
        });
      }
      const { followerId, followedId } = input;

      const follow = await ctx.prisma.userFollows.delete({
        where: {
          followerId_followedId: {
            followerId,
            followedId
          }
        }
      });

      const followNotification = await ctx.prisma.notification.findFirst({
        where: {
          type: NotificationType.FOLLOW,
          recipientId: followedId,
          notifierId: followerId
        }
      });

      if (followNotification) {
        await ctx.prisma.notification.delete({
          where: {
            id: followNotification.id
          }
        });
      }

      return follow;
    }),
  getFollowersCount: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const followersCount = await ctx.prisma.userFollows.count({
        where: {
          followedId: userId
        }
      });

      return followersCount;
    }),
  getFollowingCount: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const followingCount = await ctx.prisma.userFollows.count({
        where: {
          followerId: userId
        }
      });

      return followingCount;
    }),
  getUserFollowers: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const followsData = await ctx.prisma.userFollows.findMany({
        where: {
          followedId: userId
        },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true
            }
          }
        }
      });

      const followers = followsData.map(follow => follow.follower);

      return followers;
    })
});
