import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "src/env.mjs";
import { prisma } from "src/server/db";
import { GetServerSidePropsContext } from "next";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;

            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    //   interface User {
    //     // ...other properties
    //     // role: UserRole;
    //   }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        async signIn({ user }) {
            // Check if the user already exists in the database
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email || '' },
            });

            // If the user already exists, return true to continue the sign-in process
            if (existingUser) {
                console.log('user already exists');

                return true;
            }

            // If the user doesn't exist, create a new user in the database
            const newUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,

                    // Add any other user properties here
                },
            });


            return false;
        },
        async session({ session, user }) {
            // Fetch user data from the database
            const dbUser = await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
            });
            console.log({ dbUser })
            if (session.user) {
                // assign the user's ID to the session object
                session.user.id = user.id;

                // Check if the user exists in the database. If not, create them.

            }

            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),

        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
