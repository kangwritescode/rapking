import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from 'src/server/api/trpc';

export const articlesRouter = createTRPCRouter({
  getArticleBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { slug } = input;

      const article = await ctx.prisma.article.findUnique({
        where: {
          slug
        }
      });

      return article;
    }),
  getAllArticles: publicProcedure
    .input(
      z.object({
        limit: z.number().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit } = input;

      const articles = await ctx.prisma.article.findMany({
        take: limit ? limit : undefined,
        orderBy: {
          publishedAt: 'desc'
        }
      });

      return articles;
    }),
  incrementViews: publicProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { slug } = input;

      const updatedArticle = await ctx.prisma.article.update({
        where: {
          slug
        },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });

      return updatedArticle;
    })
});
