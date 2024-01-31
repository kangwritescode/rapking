import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { z } from 'zod';

export const pulseRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pulsePost.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to create a post'
        });
      }

      return await ctx.prisma.pulsePost.create({
        data: {
          content: input.content
        }
      });
    }),
  deletePost: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to delete a post'
        });
      }

      return await ctx.prisma.pulsePost.delete({
        where: {
          id: input.id
        }
      });
    })
});
