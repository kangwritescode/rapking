import { z } from 'zod';

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
        rapId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { lyricism, flow, originality, delivery, writtenReview, rapId } = input;

      if (writtenReview && bannedWords.some(word => writtenReview.includes(word))) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again.'
        });
      }

      // * Rate limiting
      const rateLimitResult = await rateLimit({
        maxRequests: 20,
        window: 60 * 30,
        keyString: `rap-reviews-${ctx.session.user.id}-${rapId}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / 60);
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You're doing that too much. Please wait ${resetTime} minutes to review this rap again.`
        });
      }

      const components = [lyricism, flow, originality];
      if (delivery) components.push(delivery);
      let total = components.reduce((acc, curr) => acc + curr, 0) / components.length;

      // Round total to  2 decimal places
      total = Math.round(total * 100) / 100;

      const sanitizedWrittenReview = writtenReview ? sanitize(writtenReview) : '';

      try {
        const review = await ctx.prisma.rapReview.upsert({
          where: {
            reviewerId_rapId: {
              rapId,
              reviewerId: ctx.session.user.id
            }
          },
          create: {
            lyricism,
            flow,
            originality,
            delivery,
            writtenReview: sanitizedWrittenReview,
            reviewerId: ctx.session.user.id,
            rapId,
            total
          },
          update: {
            lyricism,
            flow,
            originality,
            delivery,
            writtenReview: sanitizedWrittenReview,
            total
          }
        });

        return review;
      } catch (err: any) {
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
    })
});
