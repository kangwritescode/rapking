/*
  Warnings:

  - A unique constraint covering the columns `[userId,rapId]` on the table `RapVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RapVote_userId_rapId_key" ON "RapVote"("userId", "rapId");
