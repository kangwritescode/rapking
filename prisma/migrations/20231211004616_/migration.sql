/*
  Warnings:

  - You are about to drop the column `youtubeUrl` on the `Rap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rap" DROP COLUMN "youtubeUrl",
ADD COLUMN     "youtubeVideoId" TEXT;
