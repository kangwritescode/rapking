-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "threadCommentVoteId" TEXT;

-- CreateTable
CREATE TABLE "ThreadCommentVote" (
    "id" TEXT NOT NULL,
    "type" "CommentVoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "threadCommentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreadCommentVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ThreadCommentVote_threadCommentId_createdAt_idx" ON "ThreadCommentVote"("threadCommentId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ThreadCommentVote_userId_threadCommentId_key" ON "ThreadCommentVote"("userId", "threadCommentId");

-- AddForeignKey
ALTER TABLE "ThreadCommentVote" ADD CONSTRAINT "ThreadCommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadCommentVote" ADD CONSTRAINT "ThreadCommentVote_threadCommentId_fkey" FOREIGN KEY ("threadCommentId") REFERENCES "ThreadComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_threadCommentVoteId_fkey" FOREIGN KEY ("threadCommentVoteId") REFERENCES "ThreadCommentVote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
