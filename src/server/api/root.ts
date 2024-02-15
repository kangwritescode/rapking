import { userRouter } from 'src/server/api/routers/user';
import { createTRPCRouter } from 'src/server/api/trpc';
import { articlesRouter } from './routers/articles';
import { feedRouter } from './routers/feed';
import { gcloudRouter } from './routers/gcloud';
import { inviteTokenRouter } from './routers/inviteToken';
import { leaderboardRouter } from './routers/leaderboard';
import { notificationsRouter } from './routers/notifications';
import { pulseRouter } from './routers/pulse';
import { rapRouter } from './routers/rap';
import { rapVote } from './routers/rapVote';
import { reviewsRouter } from './routers/reviews';
import { socialLinkRouter } from './routers/socialLink';
import { threadRouter } from './routers/thread';
import { threadCommentVoteRouter } from './routers/threadCommentVote';
import { threadComments } from './routers/threadComments';
import { userFollows } from './routers/userFollows';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  rap: rapRouter,
  gcloud: gcloudRouter,
  socialLink: socialLinkRouter,
  userFollows: userFollows,
  rapVote: rapVote,
  threadComments: threadComments,
  commentVote: threadCommentVoteRouter,
  leaderboard: leaderboardRouter,
  feed: feedRouter,
  notifications: notificationsRouter,
  articles: articlesRouter,
  inviteToken: inviteTokenRouter,
  pulse: pulseRouter,
  thread: threadRouter,
  reviews: reviewsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
