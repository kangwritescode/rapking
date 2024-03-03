/*
  Warnings:

  - The values [MENTION] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('FOLLOW', 'RAP_COMMENT', 'RAP_VOTE', 'COMMENT_VOTE', 'FOLLOWED_USER_RAP', 'WALL_COMMENT', 'RAP_REVIEW', 'COLLABORATOR_ADDED', 'REVIEW_REQUEST_CREATED', 'FORUM_MENTION');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
