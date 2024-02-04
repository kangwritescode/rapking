import { z } from 'zod';

import { RapVoteType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

export const rapVote = createTRPCRouter({
  getRapLikes: publicProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const rapVotes = await ctx.prisma.rapVote.findMany({
        where: {
          rapId,
          type: RapVoteType.LIKE
        }
      });

      return rapVotes;
    }),
  createLike: protectedProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to like a rap.'
        });
      }
      const { rapId } = input;

      // Check if vote exists
      const vote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId: ctx.session.user.id,
            rapId
          }
        }
      });

      if (vote) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Vote already exists'
        });
      }

      const rapData = await ctx.prisma.rap.findUnique({
        where: {
          id: rapId
        },
        select: {
          userId: true
        }
      });

      if (!rapData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rap not found'
        });
      }

      // Start transaction for creating vote and updating rap and user points
      const [createdVote, rap] = await ctx.prisma.$transaction([
        ctx.prisma.rapVote.create({
          data: {
            type: RapVoteType.LIKE,
            userId: ctx.session.user.id,
            rapId
          }
        }),
        ctx.prisma.rap.update({
          where: {
            id: rapId
          },
          data: {
            likesCount: {
              increment: 1
            }
          }
        }),
        ctx.prisma.user.update({
          where: {
            id: rapData.userId
          },
          data: {
            points: {
              increment: 1
            }
          }
        })
      ]);

      return { createdVote, rapLikesCount: rap.likesCount };
    }),
  deleteLike: protectedProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to unlike.'
        });
      }
      const { rapId } = input;

      // Check if vote exists
      const vote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId: ctx.session.user.id,
            rapId
          }
        }
      });

      if (!vote) {
        throw new Error('Vote does not exist');
      }

      const rapData = await ctx.prisma.rap.findUnique({
        where: {
          id: rapId
        },
        select: {
          userId: true
        }
      });

      if (!rapData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rap not found'
        });
      }

      const [deletedVote, updatedRap] = await ctx.prisma.$transaction([
        ctx.prisma.rapVote.delete({
          where: {
            userId_rapId: {
              userId: ctx.session.user.id,
              rapId
            }
          }
        }),
        ctx.prisma.rap.update({
          where: {
            id: rapId
          },
          data: {
            likesCount: {
              decrement: 1
            }
          }
        }),
        ctx.prisma.user.update({
          where: {
            id: rapData.userId
          },
          data: {
            points: {
              decrement: 1
            }
          }
        })
      ]);

      return { deletedVote, rapLikesCount: updatedRap.likesCount };
    }),
  likeExists: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId, rapId } = input;

      const vote = await ctx.prisma.rapVote.findUnique({
        where: {
          userId_rapId: {
            userId,
            rapId
          }
        }
      });

      return !!vote;
    }),
  getRapLikesCount: publicProcedure
    .input(
      z.object({
        rapId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { rapId } = input;

      const count = await ctx.prisma.rapVote.count({
        where: {
          rapId,
          type: RapVoteType.LIKE
        }
      });

      return count;
    })
});
