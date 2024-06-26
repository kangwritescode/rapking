import { ReportType, ReportedEntity } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import rateLimit from 'src/redis/rateLimit';
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
        reportedId: z.string().optional(),
        forumThreadId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, threadId, threadCommentId, reportedId, reportedEntity, forumThreadId } = input;

      // * Rate limiting
      const rateLimitResult = await rateLimit({
        maxRequests: 3,
        window: 60 * 60 * 24,
        keyString: `report-${ctx.session.user.id}`
      });

      if (typeof rateLimitResult === 'number') {
        const resetTime = Math.ceil(rateLimitResult / (60 * 60));
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You have reached the maximum number of reports for today. Please try again in ${resetTime} hours.`
        });
      }

      let reportedUserId = reportedId;
      let rapId: string | null | undefined = input.rapId;

      // Reported entity is a Rap
      if (reportedEntity === ReportedEntity.RAP && rapId) {
        const rap = await ctx.prisma.rap.findUnique({
          where: {
            id: rapId
          }
        });
        reportedUserId = rap?.userId || reportedUserId;
      }

      // Reported entity is a Wall Comment
      if (reportedEntity === ReportedEntity.WALL_COMMENT && threadCommentId) {
        const wallComment = await ctx.prisma.threadComment.findUnique({
          where: {
            id: threadCommentId
          }
        });
        reportedUserId = wallComment?.userId || reportedUserId;
      }

      // Reported entity is a Forum Thread or Forum Comment
      if (
        (reportedEntity === ReportedEntity.RAP_COMMENT ||
          reportedEntity === ReportedEntity.FORUM_COMMENT) &&
        threadCommentId
      ) {
        const threadComment = await ctx.prisma.threadComment.findUnique({
          where: {
            id: threadCommentId
          }
        });

        const rapThread = await ctx.prisma.rapThread.findUnique({
          where: {
            threadId: threadComment?.threadId
          }
        });

        reportedUserId = threadComment?.userId || reportedUserId;
        rapId = rapThread?.rapId || rapId;
      }

      const report = await ctx.prisma.report.create({
        data: {
          type,
          rapId,
          threadId,
          commentId: threadCommentId,
          reportedId: reportedUserId,
          reporterId: ctx.session.user.id,
          reportedEntity: reportedEntity,
          forumThreadId
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
