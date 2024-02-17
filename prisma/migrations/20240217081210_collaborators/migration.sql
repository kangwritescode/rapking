/*
  Warnings:

  - You are about to drop the `_CollaboratorRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollaboratorRelation" DROP CONSTRAINT "_CollaboratorRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollaboratorRelation" DROP CONSTRAINT "_CollaboratorRelation_B_fkey";

-- DropTable
DROP TABLE "_CollaboratorRelation";

-- CreateTable
CREATE TABLE "_RapCollaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RapCollaborators_AB_unique" ON "_RapCollaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_RapCollaborators_B_index" ON "_RapCollaborators"("B");

-- AddForeignKey
ALTER TABLE "_RapCollaborators" ADD CONSTRAINT "_RapCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RapCollaborators" ADD CONSTRAINT "_RapCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
