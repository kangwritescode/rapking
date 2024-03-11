/*
  Warnings:

  - You are about to drop the `InviteToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhiteList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WhiteList" DROP CONSTRAINT "WhiteList_userId_fkey";

-- DropTable
DROP TABLE "InviteToken";

-- DropTable
DROP TABLE "WhiteList";
