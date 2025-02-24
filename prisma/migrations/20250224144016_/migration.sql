-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_masterDataTypeId_fkey";

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_masterDataTypeId_fkey" FOREIGN KEY ("masterDataTypeId") REFERENCES "MasterDataType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
