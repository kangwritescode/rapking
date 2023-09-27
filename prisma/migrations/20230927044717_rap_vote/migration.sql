/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RapVoteType" AS ENUM ('LIKE');

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_rapId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropTable
DROP TABLE "Vote";

-- DropEnum
DROP TYPE "VoteType";

-- CreateTable
CREATE TABLE "RapVote" (
    "id" SERIAL NOT NULL,
    "type" "RapVoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "rapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RapVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RapVote" ADD CONSTRAINT "RapVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapVote" ADD CONSTRAINT "RapVote_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
