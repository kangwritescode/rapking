import { ReportType, ReportedEntity } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from 'src/server/api/trpc';
import { z } from 'zod';

export const reportRouter = createTRPCRouter({
  postReport: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ReportType),
        reportedEntity: z.nativeEnum(ReportedEntity),
        rapId: z.string().optional(),
        threadId: z.string().optional(),
        threadCommentId: z.string().optional(),
        reportedId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, rapId, threadId, threadCommentId, reportedId, reportedEntity } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id
        }
      });

      if (!user?.isAdmin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to perform this action'
        });
      }

      let reportedUserId = reportedId;

      if (reportedEntity === ReportedEntity.RAP && rapId) {
        const rap = await ctx.prisma.rap.findUnique({
          where: {
            id: rapId
          }
        });
        reportedUserId = rap?.userId;
      }

      if (reportedEntity === ReportedEntity.RAP_COMMENT && threadCommentId) {
        const threadComment = await ctx.prisma.threadComment.findUnique({
          where: {
            id: threadCommentId
          }
        });
        reportedUserId = threadComment?.userId;
      }

      const report = await ctx.prisma.report.create({
        data: {
          type,
          rapId,
          threadId,
          commentId: threadCommentId,
          reportedId: reportedUserId,
          reporterId: ctx.session.user.id,
          reportedEntity: reportedEntity
        }
      });

      return report;
    }),
  getAllReports: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.report.findMany({
      include: {
        rap: true,
        reporter: true,
        reported: true,
        threadComment: true
      }
    });
  }),
  deleteReport: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      }
    });

    if (!user?.isAdmin) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to perform this action'
      });
    }

    return ctx.prisma.report.delete({
      where: {
        id: input
      }
    });
  }),
  deleteReports: protectedProcedure.input(z.array(z.string())).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      }
    });

    if (!user?.isAdmin) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to perform this action'
      });
    }

    return ctx.prisma.report.deleteMany({
      where: {
        id: {
          in: input
        }
      }
    });
  })
});
