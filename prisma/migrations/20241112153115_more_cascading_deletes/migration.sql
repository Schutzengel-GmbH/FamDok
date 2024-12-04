-- DropForeignKey
ALTER TABLE "DataFieldAnswer" DROP CONSTRAINT "DataFieldAnswer_dataFieldId_fkey";

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_dataFieldId_fkey" FOREIGN KEY ("dataFieldId") REFERENCES "DataField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
