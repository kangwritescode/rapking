/*
  Warnings:

  - Made the column `disableComments` on table `Rap` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Rap" ADD COLUMN     "youtubeUrl" TEXT,
ALTER COLUMN "disableComments" SET NOT NULL;
