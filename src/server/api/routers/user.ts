import sanitize from 'sanitize-html';
import { z } from 'zod';

import { Country } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { containsBannedWords } from 'src/shared/bannedWords';

// Schemas
const updateUserInputSchema = z.object({
  username: z.string().optional(),
  sex: z.string().optional(),
  dob: z.date().optional(),
  country: z.nativeEnum(Country).optional(),
  bannerUrl: z.string().optional(),
  profileImageUrl: z.string().optional(),
  bio: z.string().max(200).optional(),
  lastOnline: z.date().optional()
});

// Types
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

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
          country: true,
          wall: {
            select: {
              threadId: true
            }
          }
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
    .input(
      z.object({
        text: z.string(),
        limit: z.number().optional(),
        excludeSelf: z.boolean().optional()
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          username: {
            contains: input.text,
            mode: 'insensitive'
          },
          profileIsComplete: true,
          id: {
            not: input.excludeSelf && ctx?.session?.user.id ? ctx.session.user.id : undefined
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
  updateUser: protectedProcedure.input(updateUserInputSchema).mutation(async ({ input, ctx }) => {
    // Ensures user that is updating is the same as the one in the session
    const userToUpdate = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id }
    });

    // Checks if username is already taken
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

    // Sanitizes bio
    const sanitizedBio = sanitize(input.bio ?? '', {
      allowedTags: [],
      allowedAttributes: {}
    });

    // checks if bio or username contains banned words
    if (containsBannedWords(sanitizedBio) || containsBannedWords(input.username ?? '')) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later'
      });
    }

    // Updates user
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
        ...(input.bio ? { bio: sanitizedBio } : {}),
        ...(input.country && userToUpdate.username && userToUpdate.sex && userToUpdate.dob
          ? { profileIsComplete: true }
          : {}),
        ...(input.lastOnline ? { lastOnline: input.lastOnline } : {})
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
    const deletedUser = await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id
      }
    });

    return deletedUser;
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
