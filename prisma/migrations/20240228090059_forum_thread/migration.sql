/*
  Warnings:

  - Added the required column `title` to the `ForumThread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForumThread" ADD COLUMN     "title" TEXT NOT NULL;
