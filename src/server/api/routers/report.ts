import { ReportType, ReportedEntity } from '@prisma/client';
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
        commentId: z.string().optional(),
        reportedId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, rapId, threadId, commentId, reportedId, reportedEntity } = input;

      let reportedUserId = reportedId;

      if (reportedEntity === ReportedEntity.RAP && rapId) {
        const rap = await ctx.prisma.rap.findUnique({
          where: {
            id: rapId
          }
        });
        reportedUserId = rap?.userId;
      }

      const report = await ctx.prisma.report.create({
        data: {
          type,
          rapId,
          threadId,
          commentId,
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
        reported: true
      }
    });
  }),
  deleteReport: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.report.delete({
      where: {
        id: input
      }
    });
  }),
  deleteReports: protectedProcedure.input(z.array(z.string())).mutation(async ({ ctx, input }) => {
    return ctx.prisma.report.deleteMany({
      where: {
        id: {
          in: input
        }
      }
    });
  })
});
