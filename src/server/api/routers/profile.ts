import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "src/server/api/trpc";

export const profileRouter = createTRPCRouter({
    findByUsername: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.profile.findUnique({
                where: {
                    username: input.text,
                },
            })
        }),
    usernameIsAvailable: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(async ({ input, ctx }) => {
            const profile = await ctx.prisma.profile.findUnique({
                where: {
                    username: input.text,
                },
            })
            
            return {
                isAvailable: profile === null,
            };
        }),
});
