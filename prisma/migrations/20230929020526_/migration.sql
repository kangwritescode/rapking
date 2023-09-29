/*
  Warnings:

  - The primary key for the `RapComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RapVote` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "RapComment" DROP CONSTRAINT "RapComment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RapComment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RapComment_id_seq";

-- AlterTable
ALTER TABLE "RapVote" DROP CONSTRAINT "RapVote_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RapVote_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RapVote_id_seq";
