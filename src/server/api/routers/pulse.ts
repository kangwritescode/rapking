import { createTRPCRouter, publicProcedure } from 'src/server/api/trpc';

export const pulseRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pulsePost.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  })
});
