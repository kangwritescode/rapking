import { z } from 'zod';

import { Rap } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import path from 'path';
import { deleteGloudFile, moveGCloudFile } from 'src/gcloud/serverMethods';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

// Schemas
const createRapPayloadSchema = z.object({
  title: z.string(),
  content: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtDraftUrl: z.string().optional().nullable()
});
const updateRapPayloadSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  coverArtUrl: z.string().optional().nullable()
});

const sortBySchema = z.enum(['NEWEST', 'TOP']);
const timeFilterSchema = z.enum(['ALL', '24HOURS', '7DAYS', '30DAYS', '6MONTHS', '12MONTHS']);
const regionFilterSchema = z.enum(['ALL', 'WEST', 'MIDWEST', 'EAST', 'SOUTH']);
const sexFilterSchema = z.enum(['ANY', 'MALE', 'FEMALE']);

// Types
export type CreateRapPayload = z.infer<typeof createRapPayloadSchema>;
export type UpdateRapPayload = z.infer<typeof updateRapPayloadSchema>;

export type SortByValue = z.infer<typeof sortBySchema>;
export type TimeFilter = z.infer<typeof timeFilterSchema>;
export type RegionFilter = z.infer<typeof regionFilterSchema>;
export type SexFilter = z.infer<typeof sexFilterSchema>;

export const rapRouter = createTRPCRouter({
  createRap: protectedProcedure.input(createRapPayloadSchema).mutation(async ({ input, ctx }) => {
    if (input.title.length < 3) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Title must be at least 3 characters.'
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

    let rap = await ctx.prisma.rap.create({
      data: {
        title: input.title,
        content: input.content,
        status: input.status,
        userId: ctx.session.user.id
      }
    });

    if (input.coverArtDraftUrl) {
      const extension = path.extname(input.coverArtDraftUrl);
      const newCoverArtUrl = `rap/${rap.id}/cover-art-${Date.now()}${extension}`;
      const response = await moveGCloudFile('rapking', input.coverArtDraftUrl, newCoverArtUrl);
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
    // check if a rap with the same title already exists
    const existingRap = await ctx.prisma.rap.findUnique({
      where: {
        id: input.id
      }
    });

    if (!existingRap) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No rap with this id exists.'
      });
    }

    const newCoverArtUrl = await updateCoverArtUrl(input, existingRap);

    return await ctx.prisma.rap.update({
      where: {
        id: input.id
      },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.content && { content: input.content }),
        ...(input.status && { status: input.status }),
        coverArtUrl: newCoverArtUrl
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
          user: true
        }
      });
    }),
  getRapsByUser: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.rap.findMany({
      where: {
        userId: input.userId
      },
      include: {
        user: true
      }
    });
  }),
  deleteRap: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const rap = await ctx.prisma.rap.findUnique({
      where: {
        id: input.id
      }
    });

    if (!rap) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No rap with this id exists.'
      });
    }

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
  const isChanging = input.coverArtUrl && existingRap.coverArtUrl;

  // If user is deleting or changing the cover art, delete the existing file
  if (isDeleting || isChanging) {
    await deleteGloudFile('rapking', existingRap.coverArtUrl!);
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
