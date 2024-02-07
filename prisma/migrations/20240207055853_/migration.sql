/*
  Warnings:

  - The primary key for the `InviteToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `InviteToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_pkey",
DROP COLUMN "token",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "InviteToken_id_seq";
