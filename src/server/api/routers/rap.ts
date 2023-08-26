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
      try {

        const existingProfile = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (!existingProfile) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Profile not found",
          });
        }

        // check if a rap with the same title already exists
        const existingRap = await ctx.prisma.rap.findUnique({
          where: { title: input.title },
        });

        if (existingProfile) {
          return await ctx.prisma.rap.create({
            data: {
              title: input.title,
              content: input.content,
              profileId: existingProfile.id,
            },
          })
        }

        return [];
      } catch (error) {
        console.log(error);
      }
    }),
});

