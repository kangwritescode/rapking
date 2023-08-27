import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const rapRouter = createTRPCRouter({
  createRap: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {

      // check if a rap with the same title already exists
      const existingRap = await ctx.prisma.rap.findFirst({
        where: {
          title: input.title,
          userId: ctx.session.user.id
        },
      });

      if (existingRap) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A rap with this title already exists.",
        });
      }

      return await ctx.prisma.rap.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id,
        },
      })

    }),
  getRap: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.rap.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        }
      })
    }),
});

