import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { z } from 'zod';

export const promotionsRouter = createTRPCRouter({
  createPromotion: protectedProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id
        }
      });

      if (!currentUser?.promotionTokens) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have enough promotion tokens'
        });
      }

      const promotions = await ctx.prisma.promotion.findMany({
        where: {
          rapId: input.rapId,
          endsAt: {
            gte: new Date()
          }
        }
      });

      if (promotions.some(p => p.endsAt && p.endsAt > new Date())) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This rap is already promoted'
        });
      }

      const [createdPromotion] = await ctx.prisma.$transaction([
        ctx.prisma.promotion.create({
          data: {
            rapId: input.rapId,
            startedAt: new Date(),
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }),
        ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id
          },
          data: {
            promotionTokens: {
              decrement: 1
            }
          }
        })
      ]);

      return createdPromotion;
    }),
  getPromotedRaps: publicProcedure.query(async ({ ctx }) => {
    const promotedRaps = await ctx.prisma.rap.findMany({
      where: {
        promotions: {
          some: {
            endsAt: {
              gte: new Date()
            }
          }
        }
      }
    });

    return promotedRaps;
  }),
  getCurrentActivePromotion: publicProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const promotion = await ctx.prisma.promotion.findFirst({
        where: {
          rapId: input.rapId,
          endsAt: {
            gte: new Date()
          }
        }
      });

      return promotion;
    })
});
