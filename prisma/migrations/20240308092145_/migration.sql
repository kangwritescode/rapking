/*
  Warnings:

  - You are about to drop the column `forumThreadId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `forumThreadId` on the `ThreadComment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_forumThreadId_fkey";

-- DropForeignKey
ALTER TABLE "ThreadComment" DROP CONSTRAINT "ThreadComment_forumThreadId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "forumThreadId";

-- AlterTable
ALTER TABLE "ThreadComment" DROP COLUMN "forumThreadId";
