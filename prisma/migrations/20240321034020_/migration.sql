-- AlterTable
ALTER TABLE "User" ADD COLUMN     "promotionTokens" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "rapId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Promotion_rapId_idx" ON "Promotion"("rapId");

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
