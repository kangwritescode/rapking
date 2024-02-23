/*
  Warnings:

  - The values [ACCEPTED,CANCELLED] on the enum `ReviewRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewRequestStatus_new" AS ENUM ('PENDING', 'DECLINED');
ALTER TABLE "ReviewRequest" ALTER COLUMN "status" TYPE "ReviewRequestStatus_new" USING ("status"::text::"ReviewRequestStatus_new");
ALTER TYPE "ReviewRequestStatus" RENAME TO "ReviewRequestStatus_old";
ALTER TYPE "ReviewRequestStatus_new" RENAME TO "ReviewRequestStatus";
DROP TYPE "ReviewRequestStatus_old";
COMMIT;
