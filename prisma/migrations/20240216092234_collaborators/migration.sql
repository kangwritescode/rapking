-- CreateTable
CREATE TABLE "_CollaboratorRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollaboratorRelation_AB_unique" ON "_CollaboratorRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaboratorRelation_B_index" ON "_CollaboratorRelation"("B");

-- AddForeignKey
ALTER TABLE "_CollaboratorRelation" ADD CONSTRAINT "_CollaboratorRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Rap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaboratorRelation" ADD CONSTRAINT "_CollaboratorRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
