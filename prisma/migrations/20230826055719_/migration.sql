/*
  Warnings:

  - You are about to drop the column `profileId` on the `Rap` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rap" DROP CONSTRAINT "Rap_profileId_fkey";

-- AlterTable
ALTER TABLE "Rap" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "username" TEXT;

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Rap" ADD CONSTRAINT "Rap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
