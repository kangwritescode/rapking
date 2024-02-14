-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'RAP_REVIEW';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "rapReviewId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_rapReviewId_fkey" FOREIGN KEY ("rapReviewId") REFERENCES "RapReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
