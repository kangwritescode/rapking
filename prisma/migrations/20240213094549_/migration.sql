/*
  Warnings:

  - A unique constraint covering the columns `[reviewerId,rapId]` on the table `RapReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RapReview_reviewerId_rapId_key" ON "RapReview"("reviewerId", "rapId");
