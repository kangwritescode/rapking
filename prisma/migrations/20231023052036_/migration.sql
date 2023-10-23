-- DropIndex
DROP INDEX "SocialLink_userId_key";

-- CreateIndex
CREATE INDEX "SocialLink_userId_idx" ON "SocialLink"("userId");
