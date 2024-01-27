import sanitize from 'sanitize-html';
import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { containsBannedWords } from 'src/shared/bannedWords';

export const userRouter = createTRPCRouter({
  findByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findUniqueOrThrow({
        where: {
          username: input.username
        },
        select: {
          id: true,
          username: true,
          points: true,
          bannerUrl: true,
          profileImageUrl: true,
          bio: true,
          socialLinks: true,
          country: true
        }
      });
    }),
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id
      }
    });
  }),
  searchUserByUsername: publicProcedure
    .input(z.object({ text: z.string(), limit: z.number().optional() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          username: {
            contains: input.text,
            mode: 'insensitive'
          },
          country: {
            not: null
          }
        },
        select: {
          id: true,
          username: true,
          profileImageUrl: true
        },
        take: input.limit || 10
      });
    }),
  findById: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input.id
      },
      select: {
        id: true,
        username: true,
        points: true,
        bannerUrl: true,
        profileImageUrl: true
      }
    });
  }),
  usernameIsAvailable: protectedProcedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const userWithUsername = await ctx.prisma.user.findUnique({
        where: {
          username: input.text
        }
      });
      const rateLimitResult = await rateLimit({
        maxRequests: 20,
        window: 60 * 60, // 1 hour
        keyString: `user-username-availability-${ctx.session.user.id}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / (60 * 60)); // Convert to hours
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You can check 20 usernames every hour. Please try again in ${resetTime} hours.`
        });
      }

      const hasBannedWords = containsBannedWords(input.text);

      return {
        isAvailable:
          hasBannedWords || userWithUsername === null || userWithUsername.id === ctx.session.user.id
      };
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        sex: z.string().optional(),
        dob: z.date().optional(),
        country: z.enum(['US', 'UK', 'CA']).optional(),
        bannerUrl: z.string().optional(),
        profileImageUrl: z.string().optional(),
        bio: z.string().max(200).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id }
      });

      // checks if username is already taken
      if (input.username) {
        const userWithUsername = await ctx.prisma.user.findUnique({
          where: { username: input.username }
        });
        if (userWithUsername && userWithUsername.id !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'UNPROCESSABLE_CONTENT',
            message: 'Username already taken'
          });
        }
      }

      const sanitizedBio = sanitize(input.bio ?? '', {
        allowedTags: [],
        allowedAttributes: {}
      });

      if (containsBannedWords(sanitizedBio)) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later'
        });
      }

      // updates user
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          ...(input.username ? { username: input.username } : {}),
          ...(input.sex ? { sex: input.sex } : {}),
          ...(input.dob ? { dob: input.dob } : {}),
          ...(input.country ? { country: input.country } : {}),
          ...(input.bannerUrl ? { bannerUrl: input.bannerUrl } : {}),
          ...(input.profileImageUrl ? { profileImageUrl: input.profileImageUrl } : {}),
          ...(input.bio ? { bio: sanitizedBio } : {})
        }
      });

      return updatedUser;
    }),
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.id) {
      throw new TRPCError({
        code: 'UNPROCESSABLE_CONTENT',
        message: 'User not found'
      });
    }
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id
      }
    });

    return true;
  }),
  getProfileIsComplete: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id
      }
    });

    const profileIsComplete =
      user !== null &&
      user.username !== null &&
      user.dob !== null &&
      user.country !== null &&
      user.sex !== null;

    return profileIsComplete;
  })
});
