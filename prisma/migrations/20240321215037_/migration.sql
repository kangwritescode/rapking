/*
  Warnings:

  - A unique constraint covering the columns `[rapId]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Promotion_rapId_key" ON "Promotion"("rapId");
