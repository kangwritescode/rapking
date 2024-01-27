/*
  Warnings:

  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - The `country` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('US', 'UK', 'CA');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "city",
DROP COLUMN "region",
DROP COLUMN "state",
ADD COLUMN     "profileIsCommplete" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "country",
ADD COLUMN     "country" "Country";

-- DropEnum
DROP TYPE "Region";
