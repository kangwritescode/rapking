import { z } from 'zod';

import { CommentVoteType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

export const threadCommentVoteRouter = createTRPCRouter({
  getCommentLikes: publicProcedure
    .input(
      z.object({
        commentId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { commentId } = input;

      const likes = await ctx.prisma.threadCommentVote.findMany({
        where: {
          threadCommentId: commentId,
          type: CommentVoteType.LIKE
        }
      });

      return likes;
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
        ctx.prisma.threadCommentVote.create({
          data: {
            type: CommentVoteType.LIKE,
            userId,
            threadCommentId: commentId
          }
        }),
        ctx.prisma.threadComment.update({
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
      const vote = await ctx.prisma.threadCommentVote.findUnique({
        where: {
          userId_threadCommentId: {
            userId,
            threadCommentId: commentId
          }
        }
      });

      if (!vote) {
        throw new Error('Vote does not exist');
      }

      const [deletedVote, updatedRap] = await ctx.prisma.$transaction([
        ctx.prisma.threadCommentVote.delete({
          where: {
            userId_threadCommentId: {
              userId,
              threadCommentId: commentId
            }
          }
        }),
        ctx.prisma.threadComment.update({
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

      const vote = await ctx.prisma.threadCommentVote.findUnique({
        where: {
          userId_threadCommentId: {
            userId,
            threadCommentId: commentId
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

      const count = await ctx.prisma.threadCommentVote.count({
        where: {
          threadCommentId: commentId,
          type: CommentVoteType.LIKE
        }
      });

      return count;
    })
});
