import { userRouter } from 'src/server/api/routers/user';
import { createTRPCRouter } from 'src/server/api/trpc';
import { articlesRouter } from './routers/articles';
import { commentVoteRouter } from './routers/commentVote';
import { feedRouter } from './routers/feed';
import { gcloudRouter } from './routers/gcloud';
import { geoDBRouter } from './routers/geoDB';
import { inviteTokenRouter } from './routers/inviteToken';
import { leaderboardRouter } from './routers/leaderboard';
import { notificationsRouter } from './routers/notifications';
import { rapRouter } from './routers/rap';
import { rapComment } from './routers/rapComment';
import { rapVote } from './routers/rapVote';
import { socialLinkRouter } from './routers/socialLink';
import { userFollows } from './routers/userFollows';
import { whitelistRouter } from './routers/whitelist';

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
  leaderboard: leaderboardRouter,
  feed: feedRouter,
  notifications: notificationsRouter,
  articles: articlesRouter,
  whitelist: whitelistRouter,
  inviteToken: inviteTokenRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
