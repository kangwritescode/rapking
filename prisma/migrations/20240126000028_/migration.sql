/*
  Warnings:

  - You are about to drop the column `email` on the `WhiteList` table. All the data in the column will be lost.
  - Added the required column `userId` to the `WhiteList` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WhiteList_email_key";

-- AlterTable
ALTER TABLE "WhiteList" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;
