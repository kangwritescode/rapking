-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "forumThreadId" TEXT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_forumThreadId_fkey" FOREIGN KEY ("forumThreadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
