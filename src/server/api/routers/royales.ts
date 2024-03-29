import { RapRoyaleStatus } from '@prisma/client';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { z } from 'zod';

export const royalesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.rapRoyale.findMany({
      include: {
        submissions: {
          include: {
            user: {
              select: {
                username: true,
                profileImageUrl: true
              }
            },
            collaborators: true
          }
        }
      }
    });
  }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.rapRoyale.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          submissions: {
            include: {
              user: {
                select: {
                  username: true,
                  profileImageUrl: true,
                  country: true
                }
              },
              collaborators: true
            }
          },
          entrants: true
        }
      });
    }),
  submitRap: protectedProcedure
    .input(
      z.object({
        rapId: z.string(),
        royaleId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rapId, royaleId } = input;

      const rap = await ctx.prisma.rap.findUnique({ where: { id: rapId } });
      const royale = await ctx.prisma.rapRoyale.findUnique({
        where: { id: royaleId },
        include: {
          submissions: true
        }
      });

      if (!rap || !royale) {
        throw new Error('Invalid rap or royale');
      }

      if (rap.userId !== ctx.session.user.id) {
        throw new Error('You can only submit your own raps');
      }

      if (royale.submissions.some(submission => submission.userId === rap.userId)) {
        throw new Error('You have already submitted a rap for this royale');
      }

      if (royale.status !== RapRoyaleStatus.OPEN) {
        throw new Error('This royale is not open for submissions');
      }

      if (rap.dateCreated < royale.startDate) {
        throw new Error('This rap was created before the royale start date');
      }

      await ctx.prisma.rapRoyale.update({
        where: { id: royaleId },
        data: {
          submissions: {
            connect: {
              id: rapId
            }
          },
          entrants: {
            connect: {
              id: rap.userId
            }
          }
        }
      });

      return true;
    })
});
