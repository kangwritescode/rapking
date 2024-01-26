import { createTRPCRouter, protectedProcedure } from 'src/server/api/trpc';

export const whitelistRouter = createTRPCRouter({
  userIsInWhitelist: protectedProcedure.query(async ({ ctx }) => {
    const isInWhitelist = await ctx.prisma.whiteList.findUnique({
      where: {
        userId: ctx.session.user.id
      }
    });

    return Boolean(isInWhitelist);
  })
});
