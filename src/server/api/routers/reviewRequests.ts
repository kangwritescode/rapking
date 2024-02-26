import { z } from 'zod';

import { NotificationType, ReviewRequestStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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

      if (ctx.session.user.id === requestedUserId) {
        throw new Error('You cannot request a review from yourself');
      }

      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id
        }
      });

      // * Review Requests Tokens Check *
      if (currentUser?.reviewRequestTokens === 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'You have no review request tokens left.'
        });
      }

      // * Requested User Inbox Full Check *
      const requestedUserReviewRequestsCount = await ctx.prisma.reviewRequest.count({
        where: {
          reviewerId: requestedUserId
        }
      });

      if (requestedUserReviewRequestsCount >= 10) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'The inbox of the requested user is full.'
        });
      }

      // * Review Exists Check *
      const reviewExists = await ctx.prisma.rapReview.findFirst({
        where: {
          reviewerId: requestedUserId,
          rapId
        }
      });

      if (reviewExists) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'User has already reviewed this rap.'
        });
      }

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

        const reviewRequestTokens = Math.max((currentUser?.reviewRequestTokens || 0) - 1, 0);

        await prisma.user.update({
          where: {
            id: ctx.session.user.id
          },
          data: {
            reviewRequestTokens: reviewRequestTokens
          }
        });

        // Send notification to requested user

        await prisma.notification.create({
          data: {
            notifierId: ctx.session.user.id,
            type: NotificationType.REVIEW_REQUEST_CREATED,
            recipientId: requestedUserId,
            rapId: rapId
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

    return reviewRequestsCount || 0;
  }),
  deleteReviewRequests: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input, ctx }) => {
      const reviewRequestIds = input;

      await ctx.prisma.reviewRequest.deleteMany({
        where: {
          id: {
            in: reviewRequestIds
          }
        }
      });

      return null;
    })
});
