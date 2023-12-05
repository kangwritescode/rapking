-- AlterTable
ALTER TABLE "Rap" ADD COLUMN     "soundCloudUrl" TEXT;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
