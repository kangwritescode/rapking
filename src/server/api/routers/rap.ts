import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { rapCreateInputSchema } from "src/shared/schemas";

export const rapRouter = createTRPCRouter({
  createRap: protectedProcedure
    .input(rapCreateInputSchema)
    .mutation(async ({ input, ctx }) => {

      if (input.title.length < 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Title must be at least 3 characters.",
        });
      }

      if (input.content.length < 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Rap is too short.",
        });
      }

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
  updateRap: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {

      // check if a rap with the same title already exists
      const existingRap = await ctx.prisma.rap.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingRap) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No rap with this id exists.",
        });
      }

      return await ctx.prisma.rap.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.content && { content: input.content }),
          ...(input.status && { status: input.status })
        },
      })

    }),
  getRap: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.rap.findFirst({
        where: {
          id: input.id,
        }
      });
    }),
  getRaps: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.rap.findMany({
        where: {
          userId: input.userId
        }
      });
    }),
});

