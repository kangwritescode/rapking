/*
  Warnings:

  - Made the column `userId` on table `Rap` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Rap" DROP CONSTRAINT "Rap_userId_fkey";

-- AlterTable
ALTER TABLE "Rap" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Rap" ADD CONSTRAINT "Rap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
