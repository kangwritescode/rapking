-- DropForeignKey
ALTER TABLE "Rap" DROP CONSTRAINT "Rap_userId_fkey";

-- AddForeignKey
ALTER TABLE "Rap" ADD CONSTRAINT "Rap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
