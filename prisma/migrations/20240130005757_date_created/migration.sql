/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `PulsePost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PulsePost" DROP COLUMN "publishedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
