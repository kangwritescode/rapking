import sanitize from 'sanitize-html';
import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { stateToRegionMap } from 'src/shared/constants';

export const userRouter = createTRPCRouter({
  findByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          username: input.username
        }
      });
    }),
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
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
        take: input.limit || 10
      });
    }),
  findById: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input.id
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

      return {
        isAvailable: userWithUsername === null || userWithUsername.id === ctx.session.user.id
      };
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        sex: z.string().optional(),
        dob: z.date().optional(),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        bannerUrl: z.string().optional(),
        profileImageUrl: z.string().optional(),
        bio: z.string().max(200).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      // checks if user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id }
      });

      if (!existingUser) {
        throw new TRPCError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'User not found'
        });
      }

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

      const region = input.state ? stateToRegionMap[input.state] : null;

      const sanitizedBio = sanitize(input.bio ?? '', {
        allowedTags: [],
        allowedAttributes: {}
      });

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
          ...(input.state ? { state: input.state, region } : {}),
          ...(input.city ? { city: input.city } : {}),
          ...(input.bannerUrl ? { bannerUrl: input.bannerUrl } : {}),
          ...(input.profileImageUrl ? { profileImageUrl: input.profileImageUrl } : {}),
          ...(input.bio ? { bio: sanitizedBio } : {})
        }
      });

      return updatedUser;
    }),
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id
      }
    });

    return true;
  }),
  getProfileIsComplete: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      }
    });
    if (!user) {
      throw new TRPCError({
        code: 'UNPROCESSABLE_CONTENT',
        message: 'User not found'
      });
    }

    const profileIsComplete =
      user !== null &&
      user.username !== null &&
      user.dob !== null &&
      user.state !== null &&
      user.city !== null &&
      user.country !== null &&
      user.sex !== null;

    return profileIsComplete;
  })
});
