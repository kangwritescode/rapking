/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `WhiteList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_userId_key" ON "WhiteList"("userId");
