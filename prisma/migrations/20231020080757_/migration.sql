/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FOLLOW', 'RAP_COMMENT', 'RAP_VOTE', 'COMMENT_VOTE');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifierId" TEXT NOT NULL,
    "commentId" TEXT,
    "rapVoteId" TEXT,
    "commentVoteId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "CommentVote_commentId_createdAt_idx" ON "CommentVote"("commentId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Rap_userId_dateCreated_idx" ON "Rap"("userId", "dateCreated" DESC);

-- CreateIndex
CREATE INDEX "RapComment_rapId_createdAt_idx" ON "RapComment"("rapId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "RapVote_rapId_createdAt_idx" ON "RapVote"("rapId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_userId_key" ON "SocialLink"("userId");

-- CreateIndex
CREATE INDEX "UserFollows_followedId_idx" ON "UserFollows"("followedId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifierId_fkey" FOREIGN KEY ("notifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "RapComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_rapVoteId_fkey" FOREIGN KEY ("rapVoteId") REFERENCES "RapVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentVoteId_fkey" FOREIGN KEY ("commentVoteId") REFERENCES "CommentVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
