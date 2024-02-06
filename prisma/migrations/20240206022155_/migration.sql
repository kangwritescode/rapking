-- CreateTable
CREATE TABLE "Wall" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Wall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapThread" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "rapId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "RapThread_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wall_threadId_key" ON "Wall"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "Wall_ownerId_key" ON "Wall"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "RapThread_threadId_key" ON "RapThread"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "RapThread_rapId_key" ON "RapThread"("rapId");

-- CreateIndex
CREATE UNIQUE INDEX "RapThread_ownerId_key" ON "RapThread"("ownerId");

-- AddForeignKey
ALTER TABLE "Wall" ADD CONSTRAINT "Wall_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wall" ADD CONSTRAINT "Wall_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapThread" ADD CONSTRAINT "RapThread_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapThread" ADD CONSTRAINT "RapThread_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapThread" ADD CONSTRAINT "RapThread_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
