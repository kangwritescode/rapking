/*
  Warnings:

  - You are about to drop the column `soundCloudUrl` on the `Rap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rap" DROP COLUMN "soundCloudUrl",
ADD COLUMN     "soundcloudUrl" TEXT;
