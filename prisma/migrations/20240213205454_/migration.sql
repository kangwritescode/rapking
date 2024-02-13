/*
  Warnings:

  - You are about to alter the column `writtenReview` on the `RapReview` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "RapReview" ALTER COLUMN "writtenReview" SET DATA TYPE VARCHAR(300);
