/*
  Warnings:

  - Added the required column `organizationId` to the `SubOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubOrganization" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SubOrganization" ADD CONSTRAINT "SubOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
