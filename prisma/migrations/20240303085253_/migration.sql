-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "forumThreadId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_forumThreadId_fkey" FOREIGN KEY ("forumThreadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
