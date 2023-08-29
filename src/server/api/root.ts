import { createTRPCRouter } from "src/server/api/trpc";
import { userRouter } from "src/server/api/routers/user";
import { geoDBRouter } from "./routers/geoDB";
import { rapRouter } from "./routers/rap";
import { gcloudRouter } from "./routers/gcloud";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  geoDB: geoDBRouter,
  rap: rapRouter,
  gcloud: gcloudRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
