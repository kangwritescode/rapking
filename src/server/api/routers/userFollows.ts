import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from 'src/server/api/trpc';
import { NotificationType } from '@prisma/client';

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
    })
});
