-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "masterDataTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_masterDataTypeId_fkey" FOREIGN KEY ("masterDataTypeId") REFERENCES "MasterDataType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
