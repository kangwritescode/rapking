/*
  Warnings:

  - You are about to drop the column `profileIsCommplete` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileIsCommplete",
ADD COLUMN     "profileIsComplete" BOOLEAN NOT NULL DEFAULT false;
