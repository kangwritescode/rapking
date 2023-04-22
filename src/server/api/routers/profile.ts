import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "src/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
    findByUsername: protectedProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.profile.findUnique({
                where: {
                    username: input.text,
                },
            })
        }),
    usernameIsAvailable: protectedProcedure
        .input(z.object({
            text: z.string()
        }))
        .query(async ({ input, ctx }) => {

            const profileWithUsername = await ctx.prisma.profile.findUnique({
                where: {
                    username: input.text,
                },
            })

            return {
                isAvailable: profileWithUsername === null || profileWithUsername.userId === ctx.session.user.id,
            };
        }),
    createProfile: protectedProcedure
        .mutation(async ({ ctx }) => {
            return ctx.prisma.profile.create({
                data: {
                    userId: ctx.session.user.id,
                },
            });
        }
        ),
    updateProfile: protectedProcedure
        .input(z.object({
            username: z.string().optional(),
            sex: z.string().optional(),
            dob: z.date().optional()
        }))
        .mutation(async ({ input, ctx }) => {

            // checks if profile exists
            const existingProfile = await ctx.prisma.profile.findUnique({
                where: { userId: ctx.session.user.id },
            });

            // creates profile if it doesn't exist
            if (!existingProfile) {
                await ctx.prisma.profile.create({
                    data: {
                        userId: ctx.session.user.id,
                    },
                });
            }

            // checks if username is already taken
            if (input.username) {
                const profileWithUsername = await ctx.prisma.profile.findUnique({
                    where: { username: input.username },
                });
                if (profileWithUsername && profileWithUsername.userId !== ctx.session.user.id) {
                    throw new TRPCError({
                        code: "UNPROCESSABLE_CONTENT",
                        message: "Username already taken",
                    });
                }
            }

            // updates profile
            const updatedProfile = await ctx.prisma.profile.update({
                where: {
                    userId: ctx.session.user.id,
                },
                data: {
                    ...(input.username ? { username: input.username } : {}),
                    ...(input.sex ? { sex: input.sex } : {}),
                    ...(input.dob ? { dob: input.dob } : {}),
                },
            });

            return updatedProfile;
        })

});
