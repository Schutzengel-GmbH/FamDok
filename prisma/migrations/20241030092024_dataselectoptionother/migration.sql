/*
  Warnings:

  - You are about to drop the column `masterDataId` on the `DataFieldAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `dataFieldAnswerId` on the `SelectOption` table. All the data in the column will be lost.
  - You are about to drop the column `dataFieldId` on the `SelectOption` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SelectOption" DROP CONSTRAINT "SelectOption_dataFieldAnswerId_fkey";

-- DropForeignKey
ALTER TABLE "SelectOption" DROP CONSTRAINT "SelectOption_dataFieldId_fkey";

-- AlterTable
ALTER TABLE "DataFieldAnswer" DROP COLUMN "masterDataId";

-- AlterTable
ALTER TABLE "SelectOption" DROP COLUMN "dataFieldAnswerId",
DROP COLUMN "dataFieldId";

-- CreateTable
CREATE TABLE "DataFieldSelectOption" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT NOT NULL,

    CONSTRAINT "DataFieldSelectOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataFieldSelectOtherOption" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "dataFieldSelectOptionId" TEXT NOT NULL,
    "dataFieldAnswerId" TEXT NOT NULL,

    CONSTRAINT "DataFieldSelectOtherOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataFieldToDataFieldSelectOption" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DataFieldAnswerToDataFieldSelectOption" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DataFieldToDataFieldSelectOption_AB_unique" ON "_DataFieldToDataFieldSelectOption"("A", "B");

-- CreateIndex
CREATE INDEX "_DataFieldToDataFieldSelectOption_B_index" ON "_DataFieldToDataFieldSelectOption"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DataFieldAnswerToDataFieldSelectOption_AB_unique" ON "_DataFieldAnswerToDataFieldSelectOption"("A", "B");

-- CreateIndex
CREATE INDEX "_DataFieldAnswerToDataFieldSelectOption_B_index" ON "_DataFieldAnswerToDataFieldSelectOption"("B");

-- AddForeignKey
ALTER TABLE "DataFieldSelectOtherOption" ADD CONSTRAINT "DataFieldSelectOtherOption_dataFieldSelectOptionId_fkey" FOREIGN KEY ("dataFieldSelectOptionId") REFERENCES "DataFieldSelectOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldSelectOtherOption" ADD CONSTRAINT "DataFieldSelectOtherOption_dataFieldAnswerId_fkey" FOREIGN KEY ("dataFieldAnswerId") REFERENCES "DataFieldAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataFieldToDataFieldSelectOption" ADD CONSTRAINT "_DataFieldToDataFieldSelectOption_A_fkey" FOREIGN KEY ("A") REFERENCES "DataField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataFieldToDataFieldSelectOption" ADD CONSTRAINT "_DataFieldToDataFieldSelectOption_B_fkey" FOREIGN KEY ("B") REFERENCES "DataFieldSelectOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataFieldAnswerToDataFieldSelectOption" ADD CONSTRAINT "_DataFieldAnswerToDataFieldSelectOption_A_fkey" FOREIGN KEY ("A") REFERENCES "DataFieldAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataFieldAnswerToDataFieldSelectOption" ADD CONSTRAINT "_DataFieldAnswerToDataFieldSelectOption_B_fkey" FOREIGN KEY ("B") REFERENCES "DataFieldSelectOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
