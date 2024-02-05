/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Thread_ownerId_key" ON "Thread"("ownerId");
