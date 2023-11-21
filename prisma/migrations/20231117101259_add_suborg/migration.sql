-- CreateTable
CREATE TABLE "SubOrganization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubOrganizationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubOrganizationToUser_AB_unique" ON "_SubOrganizationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SubOrganizationToUser_B_index" ON "_SubOrganizationToUser"("B");

-- AddForeignKey
ALTER TABLE "_SubOrganizationToUser" ADD CONSTRAINT "_SubOrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SubOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubOrganizationToUser" ADD CONSTRAINT "_SubOrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
