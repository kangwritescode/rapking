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

      const reviewRequest = await ctx.prisma.reviewRequest.create({
        data: {
          requesterId: ctx.session.user.id,
          reviewerId: requestedUserId,
          rapId,
          status: ReviewRequestStatus.PENDING
        }
      });

      return reviewRequest;
    })
});
