import { createTRPCRouter } from "src/server/api/trpc";
import { profileRouter } from "src/server/api/routers/profile";
import { geoDBRouter } from "./routers/geoDB";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    profile: profileRouter,
    geoDB: geoDBRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
