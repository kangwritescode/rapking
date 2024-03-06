/*
  Warnings:

  - Changed the type of `reportedEntity` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportedEntity" AS ENUM ('RAP', 'THREAD', 'THREAD_COMMENT', 'RAP_REVIEW', 'REVIEW_REQUEST', 'FORUM_THREAD');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reportedEntity",
ADD COLUMN     "reportedEntity" "ReportedEntity" NOT NULL;

-- DropEnum
DROP TYPE "ReportEntity";
