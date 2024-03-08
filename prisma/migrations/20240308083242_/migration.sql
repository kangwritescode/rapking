/*
  Warnings:

  - The values [FORUM_THREAD] on the enum `ReportedEntity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportedEntity_new" AS ENUM ('RAP', 'THREAD', 'RAP_COMMENT', 'WALL_COMMENT', 'RAP_REVIEW', 'REVIEW_REQUEST', 'FORUM_COMMENT');
ALTER TABLE "Report" ALTER COLUMN "reportedEntity" TYPE "ReportedEntity_new" USING ("reportedEntity"::text::"ReportedEntity_new");
ALTER TYPE "ReportedEntity" RENAME TO "ReportedEntity_old";
ALTER TYPE "ReportedEntity_new" RENAME TO "ReportedEntity";
DROP TYPE "ReportedEntity_old";
COMMIT;
