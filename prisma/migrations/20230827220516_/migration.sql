/*
  Warnings:

  - The `status` column on the `Rap` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Rap" DROP COLUMN "status",
ADD COLUMN     "status" "RapStatus" NOT NULL DEFAULT 'DRAFT';
