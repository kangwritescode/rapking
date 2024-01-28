import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

// Schemas
const SocialPlatformSchema = z.union([
  z.literal('TWITTER'),
  z.literal('INSTAGRAM'),
  z.literal('FACEBOOK'),
  z.literal('YOUTUBE'),
  z.literal('SOUNDCLOUD'),
  z.literal('SPOTIFY'),
  z.literal('TIKTOK'),
  z.literal('CUSTOM')
]);

const createSocialLinkPayload = z.object({
  userId: z.string(),
  platform: SocialPlatformSchema,
  link: z.string(),
  displayText: z.string()
});

const deleteSocialLinkPayload = z.object({
  id: z.string()
});

// Types
export type CreateRapPayload = z.infer<typeof createSocialLinkPayload>;
export type UpdateRapPayload = z.infer<typeof deleteSocialLinkPayload>;

export const socialLinkRouter = createTRPCRouter({
  postSocialLink: protectedProcedure
    .input(
      z.object({
        platform: SocialPlatformSchema,
        link: z.string(),
        displayText: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a social link.'
        });
      }

      return await ctx.prisma.socialLink.create({
        data: {
          platform: input.platform,
          link: input.link,
          displayText: input.displayText,
          userId: ctx.session.user.id
        }
      });
    }),
  getSocialLinkByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.socialLink.findMany({
        where: {
          userId: input.userId
        }
      });
    }),
  deleteSocialLink: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!Boolean(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to delete a social link.'
        });
      }

      return await ctx.prisma.socialLink.delete({
        where: {
          id: input.id
        }
      });
    })
});
