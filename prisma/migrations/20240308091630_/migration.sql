-- AlterTable
ALTER TABLE "ThreadComment" ADD COLUMN     "forumThreadId" TEXT;

-- AddForeignKey
ALTER TABLE "ThreadComment" ADD CONSTRAINT "ThreadComment_forumThreadId_fkey" FOREIGN KEY ("forumThreadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
