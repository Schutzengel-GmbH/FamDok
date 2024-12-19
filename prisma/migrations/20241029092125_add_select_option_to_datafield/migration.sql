-- AlterTable
ALTER TABLE "SelectOption" ADD COLUMN     "dataFieldId" TEXT;

-- AddForeignKey
ALTER TABLE "SelectOption" ADD CONSTRAINT "SelectOption_dataFieldId_fkey" FOREIGN KEY ("dataFieldId") REFERENCES "DataField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
