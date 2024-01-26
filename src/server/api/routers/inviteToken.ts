import { createTRPCRouter, protectedProcedure } from 'src/server/api/trpc';
import { z } from 'zod';

export const inviteTokenRouter = createTRPCRouter({
  verifyCode: protectedProcedure
    .input(
      z.object({
        code: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.inviteToken.findUniqueOrThrow({
        where: {
          token: input.code
        }
      });

      await ctx.prisma.$transaction([
        ctx.prisma.whiteList.create({
          data: {
            userId: ctx.session.user.id
          }
        }),
        ctx.prisma.inviteToken.delete({
          where: {
            token: input.code
          }
        })
      ]);

      return true;
    })
});
