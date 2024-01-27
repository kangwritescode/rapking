import sanitize from 'sanitize-html';
import { z } from 'zod';

import { Rap } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import path from 'path';
import { deleteGloudFile, moveGCloudFile } from 'src/gcloud/serverMethods';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { containsBannedWords } from 'src/shared/bannedWords';

// Schemas
const createRapPayloadSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)'),
  content: z.string().max(3000),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtUrl: z.string().optional().nullable(),
  soundcloudUrl: z.string().optional().nullable(),
  youtubeVideoId: z.string().optional().nullable(),
  disableComments: z.boolean().optional()
});
const updateRapPayloadSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)')
    .optional(),
  content: z.string().max(3000).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtUrl: z.string().optional().nullable(),
  soundcloudUrl: z.string().optional().nullable(),
  youtubeVideoId: z.string().optional().nullable(),
  disableComments: z.boolean().optional()
});

const sortBySchema = z.enum(['NEWEST', 'TOP']);
const timeFilterSchema = z.enum(['ALL', '24HOURS', '7DAYS', '30DAYS', '6MONTHS', '12MONTHS']);
const countryFilterSchema = z.enum(['ALL', 'US', 'UK', 'CA']);
const sexFilterSchema = z.enum(['ANY', 'MALE', 'FEMALE']);

// Types
export type CreateRapPayload = z.infer<typeof createRapPayloadSchema>;
export type UpdateRapPayload = z.infer<typeof updateRapPayloadSchema>;

export type SortByValue = z.infer<typeof sortBySchema>;
export type TimeFilter = z.infer<typeof timeFilterSchema>;
export type CountryFilter = z.infer<typeof countryFilterSchema>;
export type SexFilter = z.infer<typeof sexFilterSchema>;

export const rapRouter = createTRPCRouter({
  createRap: protectedProcedure.input(createRapPayloadSchema).mutation(async ({ input, ctx }) => {
    if (!Boolean(ctx.session.user.id)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to create a rap.'
      });
    }

    // check if a rap with the same title already exists
    const existingRap = await ctx.prisma.rap.findFirst({
      where: {
        title: input.title,
        userId: ctx.session.user.id
      }
    });

    if (existingRap) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'A rap with this title already exists.'
      });
    }

    // * Content Moderation
    if (containsBannedWords(input.title) || containsBannedWords(input.content)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Your rap has innapropriate content.'
      });
    }

    // * Rate limiting
    const rateLimitResult = await rateLimit({
      maxRequests: 3,
      window: 60 * 60 * 24, // 24 hours
      keyString: `rap-${ctx.session.user.id}`
    });

    if (typeof rateLimitResult === 'number') {
      const resetTime = Math.ceil(rateLimitResult / (60 * 60)); // Convert to hours
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `You can post 5 raps per day. Please try again in ${resetTime} hours.`
      });
    }

    let rap = await ctx.prisma.rap.create({
      data: {
        title: sanitize(input.title, { allowedTags: [], allowedAttributes: {} }),
        content: sanitize(input.content, {
          allowedTags: ['p', 'br', 'b', 'strong', 'i', 'em', 'u'],
          allowedAttributes: {
            a: ['href']
          }
        }),
        status: input.status,
        userId: ctx.session.user.id,
        soundcloudUrl: input.soundcloudUrl,
        youtubeVideoId: input.youtubeVideoId,
        disableComments: input.disableComments
      }
    });

    if (input.coverArtUrl) {
      const extension = path.extname(input.coverArtUrl);
      const newCoverArtUrl = `rap/${rap.id}/cover-art-${Date.now()}${extension}`;
      const response = await moveGCloudFile('rapking', input.coverArtUrl, newCoverArtUrl);
      if (response) {
        rap = await ctx.prisma.rap.update({
          where: {
            id: rap.id
          },
          data: {
            coverArtUrl: newCoverArtUrl
          }
        });
      }
    }

    return rap;
  }),
  updateRap: protectedProcedure.input(updateRapPayloadSchema).mutation(async ({ input, ctx }) => {
    const existingRap = await ctx.prisma.rap.findFirstOrThrow({
      where: {
        id: input.id,
        userId: ctx.session.user.id
      }
    });

    // Authorization check
    if (existingRap.userId !== ctx.session.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not authorized to update this rap.'
      });
    }

    // * Content Moderation
    if (containsBannedWords(input.title!) || containsBannedWords(input.content!)) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.'
      });
    }

    const newCoverArtUrl = await updateCoverArtUrl(input, existingRap);

    return await ctx.prisma.rap.update({
      where: {
        id: input.id
      },
      data: {
        ...(input.title && {
          title: sanitize(input.title, {
            allowedTags: [],
            allowedAttributes: {}
          })
        }),
        ...(input.content && {
          content: sanitize(input.content, {
            allowedTags: ['p', 'br', 'b', 'strong', 'i', 'em', 'u'],
            allowedAttributes: {
              a: ['href']
            }
          })
        }),
        ...(input.status && { status: input.status }),
        soundcloudUrl: input.soundcloudUrl,
        youtubeVideoId: input.youtubeVideoId,
        coverArtUrl: newCoverArtUrl,
        disableComments: input.disableComments
      }
    });
  }),
  getRap: publicProcedure
    .input(
      z.object({
        id: z.string(),
        withUser: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.rap.findFirst({
        where: {
          id: input.id
        },
        include: {
          user: {
            select: {
              username: true,
              profileImageUrl: true
            }
          }
        }
      });
    }),
  getRapsByUser: protectedProcedure
    .input(z.object({ userId: z.string(), publishedOnly: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.rap.findMany({
        where: {
          userId: input.userId,
          ...(input.publishedOnly && { status: 'PUBLISHED' })
        },
        include: {
          user: {
            select: {
              username: true,
              profileImageUrl: true
            }
          }
        }
      });
    }),
  searchRapsByTitle: publicProcedure
    .input(z.object({ text: z.string(), limit: z.number().optional() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.rap.findMany({
        where: {
          title: {
            contains: input.text,
            mode: 'insensitive'
          },
          status: 'PUBLISHED'
        },
        take: input.limit || 10
      });
    }),
  deleteRap: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rap = await ctx.prisma.rap.findUniqueOrThrow({
        where: {
          id: input.id
        }
      });

      if (rap.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You do not have permission to delete this rap.'
        });
      }

      await ctx.prisma.$transaction([
        ctx.prisma.rap.delete({
          where: {
            id: input.id
          }
        }),
        ctx.prisma.user.update({
          where: {
            id: rap.userId
          },
          data: {
            points: {
              decrement: rap.likesCount
            }
          }
        })
      ]);

      return true;
    })
});

async function updateCoverArtUrl(input: UpdateRapPayload, existingRap: Rap) {
  const isDeleting = !input.coverArtUrl && existingRap.coverArtUrl;
  const isNewUpload = input.coverArtUrl && !existingRap.coverArtUrl;
  const isChanging =
    input.coverArtUrl && existingRap.coverArtUrl && input.coverArtUrl !== existingRap.coverArtUrl;

  // If user is deleting or changing the cover art, delete the existing file
  if (isDeleting || isChanging) {
    try {
      await deleteGloudFile('rapking', existingRap.coverArtUrl!);
    } catch (err) {
      console.error(err);
    }
  }

  // If user is uploading or changing the cover art, move the new file
  if (isNewUpload || isChanging) {
    const extension = path.extname(input.coverArtUrl!);
    const newCoverArtUrl = `rap/${existingRap.id}/cover-art-${Date.now()}${extension}`;

    await moveGCloudFile('rapking', input.coverArtUrl!, newCoverArtUrl);

    return newCoverArtUrl;
  }

  // If user deleted the cover art, return null
  if (isDeleting) return null;

  // If there are no changes, return the existing cover art URL
  return existingRap.coverArtUrl;
}
