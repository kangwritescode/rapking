import { z } from 'zod';

import { NotificationType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import sanitize from 'sanitize-html';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure } from 'src/server/api/trpc';
import { bannedWords } from 'src/shared/bannedWords';

export const reviewsRouter = createTRPCRouter({
  upsertReview: protectedProcedure
    .input(
      z.object({
        lyricism: z.number(),
        flow: z.number(),
        originality: z.number(),
        delivery: z.number().optional(),
        writtenReview: z.string().optional(),
        rapId: z.string(),
        reviewerId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { lyricism, flow, originality, delivery, writtenReview, rapId, reviewerId } = input;

      // * Check if the review contains banned words
      if (writtenReview && bannedWords.some(word => writtenReview.includes(word))) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again.'
        });
      }

      // * Make sure the rap exists
      const rap = await ctx.prisma.rap.findUniqueOrThrow({
        where: {
          id: rapId
        }
      });

      // User cannot review their own rap
      if (rap.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot review your own rap.'
        });
      }

      // * Rate limiting
      const rateLimitResult = await rateLimit({
        maxRequests: 2,
        window: 60 * 30,
        keyString: `rap-reviews-${reviewerId}-${rapId}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / 60);
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You're doing that too much. Please wait ${resetTime} minutes to review this rap again.`
        });
      }

      // * Calculate the total score
      const components = [lyricism, flow, originality];
      if (delivery) components.push(delivery);
      let total = components.reduce((acc, curr) => acc + curr, 0) / components.length;
      total = Math.round(total * 10) / 10; // Round to one decimal place

      // * Sanitize the written review
      const sanitizedWrittenReview = writtenReview ? sanitize(writtenReview) : '';

      // * Check if the user has already reviewed this rap
      const existingReview = await ctx.prisma.rapReview.findUnique({
        where: {
          reviewerId_rapId: {
            rapId,
            reviewerId: reviewerId
          }
        }
      });

      // * Calculate the points to increment
      let userPointsToIncrement = 0;

      if (!existingReview) {
        userPointsToIncrement = getPointsFromReviewTotal(total);
      } else {
        const previousTotal = Number(existingReview.total);
        const newPoints = getPointsFromReviewTotal(total);
        const oldPoints = getPointsFromReviewTotal(previousTotal);
        userPointsToIncrement = newPoints - oldPoints;
      }

      try {
        const review = await ctx.prisma.$transaction(async prisma => {
          // * First, upsert the review
          const review = await prisma.rapReview.upsert({
            where: {
              reviewerId_rapId: {
                rapId,
                reviewerId: reviewerId
              }
            },
            create: {
              lyricism,
              flow,
              originality,
              delivery,
              writtenReview: sanitizedWrittenReview,
              reviewerId: reviewerId,
              rapId,
              total
            },
            update: {
              lyricism,
              flow,
              originality,
              delivery,
              writtenReview: sanitizedWrittenReview,
              total,
              reviewerId
            }
          });

          // * Then, increment the user's points
          const userId = rap.userId;

          await prisma.user.update({
            where: {
              id: userId
            },
            data: {
              points: {
                increment: userPointsToIncrement
              }
            }
          });

          return review;
        });

        // * If the user has not reviewed this rap before, send a notification to the rap owner
        if (!existingReview) {
          const rap = await ctx.prisma.rap.findUnique({
            where: {
              id: rapId
            }
          });

          if (!rap) {
            return review;
          }

          await ctx.prisma.notification.create({
            data: {
              type: NotificationType.RAP_REVIEW,
              recipientId: rap.userId,
              notifierId: reviewerId,
              rapReviewId: review.id,
              rapId
            }
          });
        }

        return review;
      } catch (err: any) {
        // * Catch any errors and return the appropriate error message
        if (err.code === 'P2000') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Review is too long. Please keep it under 300 characters.'
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again.'
        });
      }
    }),
  getReview: protectedProcedure
    .input(z.object({ rapId: z.string(), userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const review = await ctx.prisma.rapReview.findUnique({
        where: {
          reviewerId_rapId: {
            rapId: input.rapId,
            reviewerId: input.userId
          }
        }
      });

      return review;
    }),
  currentUserReview: protectedProcedure
    .input(z.object({ rapId: z.string() }))
    .query(async ({ input, ctx }) => {
      const review = await ctx.prisma.rapReview.findUnique({
        where: {
          reviewerId_rapId: {
            rapId: input.rapId,
            reviewerId: ctx.session.user.id
          }
        }
      });

      return review;
    }),
  getRapReviewsWithUserReview: protectedProcedure
    .input(z.object({ rapId: z.string() }))
    .query(async ({ input, ctx }) => {
      const reviews = await ctx.prisma.rapReview.findMany({
        where: {
          rapId: input.rapId
        },
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true
            }
          }
        }
      });

      const userReview = reviews.find(review => review.reviewerId === ctx.session.user.id);

      if (userReview) {
        const userReviewIndex = reviews.indexOf(userReview);
        reviews.splice(userReviewIndex, 1);
        reviews.unshift(userReview);
      }

      return reviews;
    }),
  getOverallRatings: protectedProcedure
    .input(z.object({ rapId: z.string() }))
    .query(async ({ input, ctx }) => {
      const reviews = await ctx.prisma.rapReview.findMany({
        where: {
          rapId: input.rapId
        },
        select: {
          lyricism: true,
          flow: true,
          originality: true,
          delivery: true,
          total: true
        }
      });

      let lyricismSum = 0;
      let flowSum = 0;
      let originalitySum = 0;
      let deliverySum = 0;
      let totalSum = 0;
      let deliveryCount = 0;

      reviews.forEach(review => {
        lyricismSum += Number(review.lyricism);
        flowSum += Number(review.flow);
        originalitySum += Number(review.originality);
        totalSum += Number(review.total);
        if (review.delivery !== null) {
          deliverySum += Number(review.delivery);
          deliveryCount++;
        }
      });

      const count = reviews.length;
      const overallRatings = {
        lyricism: count > 0 ? (lyricismSum / count).toFixed(1) : 0,
        flow: count > 0 ? (flowSum / count).toFixed(1) : 0,
        originality: count > 0 ? (originalitySum / count).toFixed(1) : 0,
        delivery: deliveryCount > 0 ? (deliverySum / deliveryCount).toFixed(1) : null,
        total: count > 0 ? (totalSum / count).toFixed(1) : 0
      };

      return overallRatings;
    }),
  deleteReview: protectedProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const review = await ctx.prisma.rapReview.findUnique({
        where: {
          id: input.reviewId
        }
      });

      if (!review) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Review not found.'
        });
      }

      if (review.reviewerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to do that.'
        });
      }

      const rap = await ctx.prisma.rap.findUniqueOrThrow({
        where: {
          id: review.rapId
        }
      });

      const previousTotal = Number(review.total);

      const userPointsToDecrement = getPointsFromReviewTotal(previousTotal);

      const [deletedReview] = await ctx.prisma.$transaction([
        ctx.prisma.rapReview.delete({
          where: {
            id: input.reviewId
          }
        }),
        ctx.prisma.user.update({
          where: {
            id: rap.userId
          },
          data: {
            points: {
              decrement: userPointsToDecrement
            }
          }
        })
      ]);

      return deletedReview;
    }),
  userHasReviewed: protectedProcedure
    .input(z.object({ rapId: z.string() }))
    .query(async ({ input, ctx }) => {
      const review = await ctx.prisma.rapReview.findUnique({
        where: {
          reviewerId_rapId: {
            rapId: input.rapId,
            reviewerId: ctx.session.user.id
          }
        }
      });

      return !!review;
    })
});

const getPointsFromReviewTotal = (total: number) => {
  if (total === 5) {
    return 3;
  } else if (total >= 4) {
    return 2;
  } else if (total >= 3) {
    return 1;
  } else {
    return 0;
  }
};
