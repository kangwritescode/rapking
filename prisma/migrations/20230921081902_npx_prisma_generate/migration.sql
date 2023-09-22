/*
  Warnings:

  - Changed the type of `platform` on the `UserSocialLink` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('TWITTER', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'SOUNDCLOUD', 'SPOTIFY', 'TIKTOK', 'CUSTOM');

-- AlterTable
ALTER TABLE "UserSocialLink" DROP COLUMN "platform",
ADD COLUMN     "platform" "SocialPlatform" NOT NULL;
