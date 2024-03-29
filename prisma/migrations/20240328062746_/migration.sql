-- AlterTable
ALTER TABLE "RapRoyale" ADD COLUMN     "prize" TEXT,
ADD COLUMN     "winnerId" TEXT;

-- AddForeignKey
ALTER TABLE "RapRoyale" ADD CONSTRAINT "RapRoyale_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
