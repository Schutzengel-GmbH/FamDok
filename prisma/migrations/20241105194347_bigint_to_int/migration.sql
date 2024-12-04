/*
  Warnings:

  - You are about to alter the column `masterDataNumber` on the `DataFieldAnswer` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `MasterData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `number` on the `MasterData` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `masterDataNumber` on the `Response` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "DataFieldAnswer" DROP CONSTRAINT "DataFieldAnswer_masterDataMasterDataTypeName_masterDataNum_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_masterDataMasterDataTypeName_masterDataNumber_fkey";

-- AlterTable
ALTER TABLE "DataFieldAnswer" ALTER COLUMN "masterDataNumber" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "MasterData" DROP CONSTRAINT "MasterData_pkey",
ALTER COLUMN "number" SET DATA TYPE INTEGER,
ADD CONSTRAINT "MasterData_pkey" PRIMARY KEY ("masterDataTypeName", "number");

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "masterDataNumber" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_masterDataMasterDataTypeName_masterDataNumber_fkey" FOREIGN KEY ("masterDataMasterDataTypeName", "masterDataNumber") REFERENCES "MasterData"("masterDataTypeName", "number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_masterDataMasterDataTypeName_masterDataNum_fkey" FOREIGN KEY ("masterDataMasterDataTypeName", "masterDataNumber") REFERENCES "MasterData"("masterDataTypeName", "number") ON DELETE SET NULL ON UPDATE CASCADE;
