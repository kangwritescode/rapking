-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "rapId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
