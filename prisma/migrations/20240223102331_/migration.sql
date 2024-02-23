/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,reviewerId,rapId]` on the table `ReviewRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ReviewRequest_reviewerId_createdAt_idx";

-- CreateIndex
CREATE INDEX "ReviewRequest_rapId_idx" ON "ReviewRequest"("rapId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewRequest_requesterId_reviewerId_rapId_key" ON "ReviewRequest"("requesterId", "reviewerId", "rapId");
