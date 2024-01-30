-- CreateTable
CREATE TABLE "PulsePost" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PulsePost_pkey" PRIMARY KEY ("id")
);
