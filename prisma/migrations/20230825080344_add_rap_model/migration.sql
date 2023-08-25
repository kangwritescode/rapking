-- CreateTable
CREATE TABLE "Rap" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Rap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rap" ADD CONSTRAINT "Rap_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
