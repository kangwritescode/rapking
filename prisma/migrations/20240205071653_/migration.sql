/*
  Warnings:

  - You are about to drop the column `commentId` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `RapComment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,threadCommentId]` on the table `CommentVote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_commentId_fkey";

-- DropForeignKey
ALTER TABLE "RapComment" DROP CONSTRAINT "RapComment_rapId_fkey";

-- DropForeignKey
ALTER TABLE "RapComment" DROP CONSTRAINT "RapComment_userId_fkey";

-- DropIndex
DROP INDEX "CommentVote_commentId_createdAt_idx";

-- DropIndex
DROP INDEX "CommentVote_userId_commentId_key";

-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "commentId";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "commentId";

-- DropTable
DROP TABLE "RapComment";

-- CreateIndex
CREATE INDEX "CommentVote_threadCommentId_createdAt_idx" ON "CommentVote"("threadCommentId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_userId_threadCommentId_key" ON "CommentVote"("userId", "threadCommentId");
