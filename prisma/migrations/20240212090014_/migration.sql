-- CreateTable
CREATE TABLE "RapReview" (
    "id" SERIAL NOT NULL,
    "rapId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "lyricism" DECIMAL(3,2) NOT NULL,
    "flow" DECIMAL(3,2) NOT NULL,
    "originality" DECIMAL(3,2) NOT NULL,
    "delivery" DECIMAL(3,2),
    "total" DECIMAL(3,2) NOT NULL,
    "writtenReview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RapReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RapReview" ADD CONSTRAINT "RapReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapReview" ADD CONSTRAINT "RapReview_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
