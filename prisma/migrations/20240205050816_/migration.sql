/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ThreadCommentVote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ThreadComment" ALTER COLUMN "rapId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ThreadCommentVote" DROP COLUMN "updatedAt";
