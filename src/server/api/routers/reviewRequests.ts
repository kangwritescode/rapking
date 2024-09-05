import { z } from 'zod';

import { NotificationType, ReviewRequestStatus, User } from '@prisma/client';
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
    }),
  getPotentialReviewers: protectedProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const potentialReviewers = await ctx.prisma.$queryRaw`
        SELECT u.*
        -- do not select users who have a full inbox
        FROM "User" u
        WHERE u."id" NOT IN (
          SELECT "reviewerId"
          FROM "ReviewRequest"
          GROUP BY "reviewerId"
          HAVING COUNT("reviewerId") >= 10
        )
        AND u."lastOnline" >= NOW() - INTERVAL '30 days' -- only select users who have been online in the last 30 days
        AND u."id" != ${ctx.session.user.id} -- do not select the current user
        AND u."profileIsComplete" = true -- only select users who have completed their profile
        AND NOT EXISTS (
          SELECT 1
          FROM "ReviewRequest" rr
          WHERE rr."reviewerId" = u."id" AND rr."rapId" = ${rapId} -- do not select users who have already been requested to review this rap
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "RapReview" r
          WHERE r."reviewerId" = u."id" AND r."rapId" = ${rapId} -- do not select users who have already reviewed this rap
        )
        ORDER BY u."lastOnline" DESC
        LIMIT 3
     `;

      return potentialReviewers as (Partial<User> & {
        id: string;
        username: string;
        profileImageUrl: string;
        lastOnline: Date;
      })[];
    })
});
