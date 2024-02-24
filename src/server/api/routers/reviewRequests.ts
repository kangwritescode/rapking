import { z } from 'zod';

import { ReviewRequestStatus } from '@prisma/client';
import { createTRPCRouter, protectedProcedure } from 'src/server/api/trpc';

export const reviewRequestsRouter = createTRPCRouter({
  reviewRequestExists: protectedProcedure
    .input(
      z.object({
        reviewerId: z.string(),
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { reviewerId, rapId } = input;

      const reviewRequest = await ctx.prisma.reviewRequest.findUnique({
        where: {
          requesterId_reviewerId_rapId: {
            requesterId: ctx.session.user.id,
            reviewerId,
            rapId
          }
        }
      });

      return Boolean(reviewRequest);
    }),
  createReviewRequest: protectedProcedure
    .input(
      z.object({
        requestedUserId: z.string(),
        rapId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { requestedUserId, rapId } = input;

      // transaction
      const reviewRequest = await ctx.prisma.$transaction(async prisma => {
        const reviewRequest = await prisma.reviewRequest.create({
          data: {
            requesterId: ctx.session.user.id,
            reviewerId: requestedUserId,
            rapId,
            status: ReviewRequestStatus.PENDING
          }
        });

        const currentUser = await prisma.user.findUnique({
          where: {
            id: ctx.session.user.id
          }
        });

        const reviewRequestTokens = Math.max((currentUser?.reviewRequestTokens || 0) - 1, 0);

        await prisma.user.update({
          where: {
            id: ctx.session.user.id
          },
          data: {
            reviewRequestTokens: reviewRequestTokens
          }
        });

        return reviewRequest;
      });

      return reviewRequest;
    }),
  getReviewRequests: protectedProcedure.query(async ({ ctx }) => {
    const reviewRequests = await ctx.prisma.reviewRequest.findMany({
      where: {
        reviewerId: ctx.session.user.id
      },
      include: {
        requester: {
          select: {
            username: true
          }
        },
        rap: {
          select: {
            title: true,
            coverArtUrl: true
          }
        }
      }
    });

    return reviewRequests;
  }),
  getReviewRequestsCount: protectedProcedure.query(async ({ ctx }) => {
    const reviewRequestsCount = await ctx.prisma.reviewRequest.count({
      where: {
        reviewerId: ctx.session.user.id
      }
    });

    return reviewRequestsCount;
  })
});
