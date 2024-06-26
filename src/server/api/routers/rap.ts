import sanitize from 'sanitize-html';
import { z } from 'zod';

import { Country, NotificationType, Rap } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import path from 'path';
import { deleteGloudFile, moveGCloudFile } from 'src/gcloud/serverMethods';
import rateLimit from 'src/redis/rateLimit';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { containsBannedWords } from 'src/shared/bannedWords';
import { createRapThread } from '../procedures/rapThread';

// Schemas
const createRapPayloadSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)'),
  content: z.string().max(15000),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtUrl: z.string().optional().nullable(),
  soundcloudUrl: z.string().optional().nullable(),
  youtubeVideoId: z.string().optional().nullable(),
  disableComments: z.boolean().optional(),
  collaboratorIds: z.array(z.string()).optional()
});
const updateRapPayloadSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)')
    .optional(),
  content: z.string().max(15000).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtUrl: z.string().optional().nullable(),
  soundcloudUrl: z.string().optional().nullable(),
  youtubeVideoId: z.string().optional().nullable(),
  disableComments: z.boolean().optional(),
  collaboratorIds: z.array(z.string()).optional()
});

const sortBySchema = z.enum(['NEWEST', 'TOP']);
const timeFilterSchema = z.enum(['ALL', '24HOURS', '7DAYS', '30DAYS', '6MONTHS', '12MONTHS']);
const countryFilterSchema = z.union([z.literal('ALL'), z.nativeEnum(Country)]);
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
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.'
      });
    }

    if (input.collaboratorIds && input.collaboratorIds.length > 5) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You can only add up to 5 collaborators.'
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
        message: `You can post 3 raps per day. Please try again in ${resetTime} hours.`
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
        disableComments: input.disableComments,
        collaborators: {
          connect: input.collaboratorIds?.map(id => ({ id }))
        }
      }
    });

    await createRapThread(rap);

    if (input.coverArtUrl) {
      const extension = path.extname(input.coverArtUrl);
      const newCoverArtUrl = `rap/${rap.id}/cover-art-${Date.now()}${extension}`;
      const response = await moveGCloudFile('rapking_secure', input.coverArtUrl, newCoverArtUrl);
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

    // If rap is published, send a notification to all followers
    if (rap.status === 'PUBLISHED') {
      // Get all of the rap author's followers
      const followers = await ctx.prisma.userFollows.findMany({
        where: {
          followedId: ctx.session.user.id
        },
        select: {
          followerId: true
        }
      });

      // Create notificationData for each follower
      const notificationData = followers.map(follower => {
        return {
          recipientId: follower.followerId,
          notifierId: ctx.session.user.id,
          type: NotificationType.FOLLOWED_USER_RAP,
          rapId: rap.id
        };
      });

      // Create notifications
      await ctx.prisma.notification.createMany({
        data: notificationData
      });
    }

    // Send notifications to new collaborators
    const collaboratorIds = input.collaboratorIds || [];
    if (collaboratorIds.length > 0) {
      const notificationData = collaboratorIds.map(id => {
        return {
          recipientId: id,
          notifierId: ctx.session.user.id,
          type: NotificationType.COLLABORATOR_ADDED,
          rapId: rap.id
        };
      });

      await ctx.prisma.notification.createMany({
        data: notificationData
      });
    }

    return rap;
  }),
  updateRap: protectedProcedure.input(updateRapPayloadSchema).mutation(async ({ input, ctx }) => {
    const existingRap = await ctx.prisma.rap.findFirstOrThrow({
      where: {
        id: input.id,
        userId: ctx.session.user.id
      },
      include: {
        collaborators: true
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

    // * Rate limiting
    const rateLimitResult = await rateLimit({
      maxRequests: 30,
      window: 60 * 15, // 15 minutes
      keyString: `rap-update-${existingRap.id}-${ctx.session.user.id}`
    });

    if (typeof rateLimitResult === 'number') {
      const resetTime = Math.ceil(rateLimitResult / 60); // Convert to minutes
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `You're doing that too much. Please try again in ${resetTime} minutes.`
      });
    }

    if (input.collaboratorIds && input.collaboratorIds?.length > 5) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot exceed 5 collaborators for a rap.'
      });
    }

    const newCoverArtUrl = await updateCoverArtUrl(input, existingRap);

    const updatedRap = await ctx.prisma.rap.update({
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
        disableComments: input.disableComments,
        collaborators: {
          set: [],
          connect: input.collaboratorIds?.map(id => ({ id }))
        }
      },
      include: {
        collaborators: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    // Send notifications to new collaborators
    const existingCollaboratorIds = existingRap.collaborators.map(c => c.id);
    const toAddCollaboratorIds = updatedRap.collaborators.map(c => c.id);
    const newCollaboratorIds = toAddCollaboratorIds.filter(
      id => !existingCollaboratorIds.includes(id)
    );

    await ctx.prisma.notification.createMany({
      data: newCollaboratorIds.map(id => ({
        recipientId: id,
        notifierId: ctx.session.user.id,
        type: NotificationType.COLLABORATOR_ADDED,
        rapId: updatedRap.id
      }))
    });

    return updatedRap;
  }),
  getRap: publicProcedure
    .input(
      z.object({
        id: z.string(),
        withUser: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const rap = await ctx.prisma.rap.findFirst({
        where: {
          id: input.id
        },
        include: {
          user: {
            select: {
              username: true,
              profileImageUrl: true
            }
          },
          rapThread: {
            select: {
              threadId: true
            }
          },
          collaborators: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });

      return rap;
    }),
  getRapsByUser: publicProcedure
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
          },
          collaborators: {
            select: {
              id: true,
              username: true
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
    }),
  getRandomRaps: publicProcedure
    .input(z.object({ limit: z.number().optional(), viewedRapId: z.string() }))
    .query(async ({ ctx, input }) => {
      const viewedRap = await ctx.prisma.rap.findUniqueOrThrow({
        where: {
          id: input.viewedRapId
        },
        select: {
          dateCreated: true
        }
      });
      const raps = await ctx.prisma.rap.findMany({
        where: {
          status: 'PUBLISHED',
          dateCreated: {
            lt: viewedRap.dateCreated
          },
          id: {
            not: input.viewedRapId
          }
        },
        take: input.limit || 10,
        orderBy: {
          dateCreated: 'desc'
        },
        include: {
          user: {
            select: {
              username: true,
              profileImageUrl: true
            }
          },
          collaborators: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });

      return raps;
    }),
  getAllRapsSimple: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.rap.findMany({
        where: {
          userId: input.userId
        },
        select: {
          id: true,
          title: true
        }
      });
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
      await deleteGloudFile('rapking_secure', existingRap.coverArtUrl!);
    } catch (err) {
      console.error(err);
    }
  }

  // If user is uploading or changing the cover art, move the new file
  if (isNewUpload || isChanging) {
    const extension = path.extname(input.coverArtUrl!);
    const newCoverArtUrl = `rap/${existingRap.id}/cover-art-${Date.now()}${extension}`;

    await moveGCloudFile('rapking_secure', input.coverArtUrl!, newCoverArtUrl);

    return newCoverArtUrl;
  }

  // If user deleted the cover art, return null
  if (isDeleting) return null;

  // If there are no changes, return the existing cover art URL
  return existingRap.coverArtUrl;
}
