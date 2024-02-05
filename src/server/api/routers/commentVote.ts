import { z } from 'zod';

import { CommentVoteType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

export const commentVoteRouter = createTRPCRouter({
  getCommentLikes: publicProcedure
    .input(
      z.object({
        commentId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { commentId } = input;

      const rapVotes = await ctx.prisma.commentVote.findMany({
        where: {
          commentId,
          type: CommentVoteType.LIKE
        }
      });

      return rapVotes;
    }),
  createLike: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        commentId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to like a comment.'
        });
      }
      const { userId, commentId } = input;

      if (userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "You don't have permission to do that."
        });
      }

      // * Rate limiting
      const rateLimitResult = await rateLimit({
        maxRequests: 3,
        window: 60 * 5,
        keyString: `create-comment-vote-${ctx.session.user.id}-${commentId}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / 60);
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You're doing that too much. Please wait ${resetTime} minutes to like this comment again.`
        });
      }

      const [commentVote, rapComment] = await ctx.prisma.$transaction([
        ctx.prisma.commentVote.create({
          data: {
            type: CommentVoteType.LIKE,
            userId,
            commentId
          }
        }),
        ctx.prisma.rapComment.update({
          where: {
            id: commentId
          },
          data: {
            likesCount: {
              increment: 1
            }
          }
        })
      ]);

      return {
        commentVote,
        rapComment
      };
    }),
  deleteVote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        commentId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to unlike.'
        });
      }
      const { userId, commentId } = input;

      if (userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "You don't have permission to do that."
        });
      }

      // * Rate limiting
      const rateLimitResult = await rateLimit({
        maxRequests: 3,
        window: 60 * 5,
        keyString: `delete-comment-vote-${ctx.session.user.id}-${commentId}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / 60);
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You're doing that too much. Please wait ${resetTime} minutes to unlike this comment again.`
        });
      }

      // Check if vote exists
      const vote = await ctx.prisma.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });

      if (!vote) {
        throw new Error('Vote does not exist');
      }

      const [deletedVote, updatedRap] = await ctx.prisma.$transaction([
        ctx.prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId,
              commentId
            }
          }
        }),
        ctx.prisma.rapComment.update({
          where: {
            id: commentId
          },
          data: {
            likesCount: {
              decrement: 1
            }
          }
        })
      ]);

      return {
        deletedVote,
        updatedRap
      };
    }),
  likeExists: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        commentId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId, commentId } = input;

      const vote = await ctx.prisma.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });

      return !!vote;
    }),
  getCommentLikesCount: publicProcedure
    .input(
      z.object({
        commentId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { commentId } = input;

      const count = await ctx.prisma.commentVote.count({
        where: {
          commentId,
          type: CommentVoteType.LIKE
        }
      });

      return count;
    })
});
