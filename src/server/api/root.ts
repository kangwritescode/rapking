import { createTRPCRouter } from "src/server/api/trpc";
import { userRouter } from "src/server/api/routers/user";
import { geoDBRouter } from "./routers/geoDB";
import { rapRouter } from "./routers/rap";
import { gcloudRouter } from "./routers/gcloud";
import { socialLinkRouter } from "./routers/socialLink";
import { userFollows } from "./routers/userFollows";
import { rapVote } from "./routers/rapVote";
import { rapComment } from "./routers/rapComment";
import { commentVoteRouter } from "./routers/commentVote";
import { leaderboardRouter } from "./routers/leaderboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  geoDB: geoDBRouter,
  rap: rapRouter,
  gcloud: gcloudRouter,
  socialLink: socialLinkRouter,
  userFollows: userFollows,
  rapVote: rapVote,
  rapComment: rapComment,
  commentVote: commentVoteRouter,
  leaderboard: leaderboardRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
