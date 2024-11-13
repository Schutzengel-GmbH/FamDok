-- DropForeignKey
ALTER TABLE "DataField" DROP CONSTRAINT "DataField_masterDataTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DataFieldAnswer" DROP CONSTRAINT "DataFieldAnswer_masterDataMasterDataTypeName_masterDataNum_fkey";

-- DropForeignKey
ALTER TABLE "DataFieldSelectOtherOption" DROP CONSTRAINT "DataFieldSelectOtherOption_dataFieldAnswerId_fkey";

-- DropForeignKey
ALTER TABLE "DataFieldSelectOtherOption" DROP CONSTRAINT "DataFieldSelectOtherOption_dataFieldSelectOptionId_fkey";

-- DropForeignKey
ALTER TABLE "MasterData" DROP CONSTRAINT "MasterData_masterDataTypeId_masterDataTypeName_fkey";

-- AddForeignKey
ALTER TABLE "MasterData" ADD CONSTRAINT "MasterData_masterDataTypeId_masterDataTypeName_fkey" FOREIGN KEY ("masterDataTypeId", "masterDataTypeName") REFERENCES "MasterDataType"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_masterDataTypeId_fkey" FOREIGN KEY ("masterDataTypeId") REFERENCES "MasterDataType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_masterDataMasterDataTypeName_masterDataNum_fkey" FOREIGN KEY ("masterDataMasterDataTypeName", "masterDataNumber") REFERENCES "MasterData"("masterDataTypeName", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldSelectOtherOption" ADD CONSTRAINT "DataFieldSelectOtherOption_dataFieldSelectOptionId_fkey" FOREIGN KEY ("dataFieldSelectOptionId") REFERENCES "DataFieldSelectOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldSelectOtherOption" ADD CONSTRAINT "DataFieldSelectOtherOption_dataFieldAnswerId_fkey" FOREIGN KEY ("dataFieldAnswerId") REFERENCES "DataFieldAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
