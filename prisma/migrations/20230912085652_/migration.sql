/*
  Warnings:

  - You are about to drop the column `about` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "about",
ADD COLUMN     "bio" TEXT;
