import { z } from 'zod';

import { ForumThread, ThreadComment, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { bannedWords } from 'src/shared/bannedWords';

export type ThreadCommentWithUserData = ThreadComment & {
  user: Partial<User>;
};

export type GetForumThreadPageResponse = ForumThread & {
  thread: {
    threadComments: ThreadCommentWithUserData[];
    commentsCount: number;
  };
  owner: User;
};

export type GetForumThreadPagesResponse = GetForumThreadPageResponse[];

export type GetForumThreadResponse = ForumThread & {
  thread: {
    threadComments: ThreadCommentWithUserData[];
  };
  owner: Partial<User>;
};

export const threadRouter = createTRPCRouter({
  getThread: publicProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        rapId: z.string().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const { threadId, rapId } = input;

      if (!threadId && !rapId) {
        throw new Error('threadId or rapId required');
      }

      const thread = await ctx.prisma.thread.findFirstOrThrow({
        where: {
          id: threadId,
          rapId: rapId
        }
      });

      return thread;
    }),
  createForumThread: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const rateLimitResult = await rateLimit({
        maxRequests: 2,
        window: 60 * 60 * 24, // 24 hours
        keyString: `create-forum-thread-${ctx.session.user.id}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / (60 * 60));
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You can create 2 threads per day. Please try again in ${resetTime} hours.`
        });
      }

      const { title, content, userId } = input;

      if (bannedWords.some(word => title.includes(word) || content.includes(word))) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong.'
        });
      }

      const result = await ctx.prisma.$transaction(async prisma => {
        const thread = await prisma.thread.create({
          data: {
            type: 'FORUM',
            ownerId: userId,
            commentsCount: 1,
            threadComments: {
              create: {
                content: content,
                userId: userId
              }
            }
          }
        });

        const rapThread = await prisma.forumThread.create({
          data: {
            threadId: thread.id,
            ownerId: thread.ownerId,
            title
          }
        });

        return rapThread;
      });

      return result;
    }),
  getDiscussionsPage: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, page } = input;

      const skip = limit * (page - 1);

      const forumThreads = await ctx.prisma.forumThread.findMany({
        take: limit,
        skip,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          thread: {
            select: {
              commentsCount: true,
              threadComments: {
                take: 1,
                orderBy: {
                  createdAt: 'desc'
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true
                    }
                  }
                }
              }
            }
          },
          owner: true
        }
      });

      return forumThreads;
    }),
  getForumThreadPages: publicProcedure
    .input(
      z.object({
        pageSize: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { pageSize } = input;
      const forumThreadsCount = await ctx.prisma.forumThread.count();

      return Math.ceil(forumThreadsCount / pageSize);
    }),
  getForumThread: publicProcedure
    .input(
      z.object({
        threadId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { threadId } = input;

      const thread = await ctx.prisma.forumThread.findUnique({
        where: {
          id: threadId
        },
        include: {
          thread: {
            include: {
              threadComments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      profileImageUrl: true
                    }
                  }
                }
              }
            }
          },
          owner: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true
            }
          }
        }
      });

      return thread;
    })
});
