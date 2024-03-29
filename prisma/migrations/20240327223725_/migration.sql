-- CreateEnum
CREATE TYPE "RapRoyaleStatus" AS ENUM ('OPEN', 'ENDED');

-- AlterTable
ALTER TABLE "Rap" ADD COLUMN     "rapRoyaleId" TEXT;

-- CreateTable
CREATE TABLE "RapRoyale" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "RapRoyaleStatus" NOT NULL,

    CONSTRAINT "RapRoyale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitionEntrants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionEntrants_AB_unique" ON "_CompetitionEntrants"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionEntrants_B_index" ON "_CompetitionEntrants"("B");

-- AddForeignKey
ALTER TABLE "Rap" ADD CONSTRAINT "Rap_rapRoyaleId_fkey" FOREIGN KEY ("rapRoyaleId") REFERENCES "RapRoyale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionEntrants" ADD CONSTRAINT "_CompetitionEntrants_A_fkey" FOREIGN KEY ("A") REFERENCES "RapRoyale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionEntrants" ADD CONSTRAINT "_CompetitionEntrants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
