/*
  Warnings:

  - The `region` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('WEST', 'MIDWEST', 'SOUTH', 'EAST');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "region",
ADD COLUMN     "region" "Region";
