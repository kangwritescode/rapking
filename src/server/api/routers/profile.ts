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
});
