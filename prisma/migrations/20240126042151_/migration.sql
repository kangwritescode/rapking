-- CreateEnum
CREATE TYPE "RapVoteType" AS ENUM ('LIKE');

-- CreateEnum
CREATE TYPE "CommentVoteType" AS ENUM ('LIKE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FOLLOW', 'RAP_COMMENT', 'RAP_VOTE', 'COMMENT_VOTE');

-- CreateEnum
CREATE TYPE "RapStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('ALL', 'WEST', 'MIDWEST', 'SOUTH', 'EAST');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('TWITTER', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'SOUNDCLOUD', 'SPOTIFY', 'TIKTOK', 'CUSTOM');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "username" TEXT,
    "sex" TEXT,
    "dob" TIMESTAMP(3),
    "country" TEXT,
    "city" TEXT,
    "state" TEXT,
    "region" "Region",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bannerUrl" TEXT,
    "profileImageUrl" TEXT,
    "bio" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollows" (
    "followedId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollows_pkey" PRIMARY KEY ("followerId","followedId")
);

-- CreateTable
CREATE TABLE "Rap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coverArtUrl" TEXT,
    "status" "RapStatus" NOT NULL DEFAULT 'DRAFT',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "soundcloudUrl" TEXT,
    "youtubeVideoId" TEXT,
    "disableComments" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RapComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapVote" (
    "id" TEXT NOT NULL,
    "type" "RapVoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "rapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RapVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVote" (
    "id" TEXT NOT NULL,
    "type" "CommentVoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "link" TEXT NOT NULL,
    "displayText" TEXT,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifierId" TEXT NOT NULL,
    "rapId" TEXT,
    "commentId" TEXT,
    "rapVoteId" TEXT,
    "commentVoteId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteList" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InviteToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToArticleTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "UserFollows_followedId_idx" ON "UserFollows"("followedId");

-- CreateIndex
CREATE INDEX "Rap_userId_dateCreated_idx" ON "Rap"("userId", "dateCreated" DESC);

-- CreateIndex
CREATE INDEX "RapComment_rapId_createdAt_idx" ON "RapComment"("rapId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "RapVote_rapId_createdAt_idx" ON "RapVote"("rapId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "RapVote_userId_rapId_key" ON "RapVote"("userId", "rapId");

-- CreateIndex
CREATE INDEX "CommentVote_commentId_createdAt_idx" ON "CommentVote"("commentId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_userId_commentId_key" ON "CommentVote"("userId", "commentId");

-- CreateIndex
CREATE INDEX "SocialLink_userId_idx" ON "SocialLink"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Notification_recipientId_createdAt_idx" ON "Notification"("recipientId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTag_name_key" ON "ArticleTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_userId_key" ON "WhiteList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InviteToken_token_key" ON "InviteToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToArticleTag_AB_unique" ON "_ArticleToArticleTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToArticleTag_B_index" ON "_ArticleToArticleTag"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rap" ADD CONSTRAINT "Rap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapComment" ADD CONSTRAINT "RapComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapComment" ADD CONSTRAINT "RapComment_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapVote" ADD CONSTRAINT "RapVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapVote" ADD CONSTRAINT "RapVote_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "RapComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifierId_fkey" FOREIGN KEY ("notifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "RapComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_rapVoteId_fkey" FOREIGN KEY ("rapVoteId") REFERENCES "RapVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentVoteId_fkey" FOREIGN KEY ("commentVoteId") REFERENCES "CommentVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteList" ADD CONSTRAINT "WhiteList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD CONSTRAINT "_ArticleToArticleTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD CONSTRAINT "_ArticleToArticleTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ArticleTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
