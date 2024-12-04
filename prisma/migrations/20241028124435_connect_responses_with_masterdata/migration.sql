/*
  Warnings:

  - The primary key for the `MasterData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MasterData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `MasterData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,name]` on the table `MasterDataType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `masterDataTypeName` to the `MasterData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DataFieldAnswer" DROP CONSTRAINT "DataFieldAnswer_masterDataId_fkey";

-- DropForeignKey
ALTER TABLE "MasterData" DROP CONSTRAINT "MasterData_masterDataTypeId_fkey";

-- AlterTable
ALTER TABLE "DataFieldAnswer" ADD COLUMN     "masterDataMasterDataTypeName" TEXT,
ADD COLUMN     "masterDataNumber" BIGINT;

-- AlterTable
ALTER TABLE "MasterData" DROP CONSTRAINT "MasterData_pkey",
DROP COLUMN "id",
ADD COLUMN     "masterDataTypeName" TEXT NOT NULL,
ADD COLUMN     "number" BIGSERIAL NOT NULL,
ADD CONSTRAINT "MasterData_pkey" PRIMARY KEY ("masterDataTypeName", "number");

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "masterDataId" TEXT,
ADD COLUMN     "masterDataMasterDataTypeName" TEXT,
ADD COLUMN     "masterDataNumber" BIGINT;

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "hasMasterData" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "MasterData_number_key" ON "MasterData"("number");

-- CreateIndex
CREATE UNIQUE INDEX "MasterDataType_id_name_key" ON "MasterDataType"("id", "name");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_masterDataMasterDataTypeName_masterDataNumber_fkey" FOREIGN KEY ("masterDataMasterDataTypeName", "masterDataNumber") REFERENCES "MasterData"("masterDataTypeName", "number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterData" ADD CONSTRAINT "MasterData_masterDataTypeId_masterDataTypeName_fkey" FOREIGN KEY ("masterDataTypeId", "masterDataTypeName") REFERENCES "MasterDataType"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_masterDataMasterDataTypeName_masterDataNum_fkey" FOREIGN KEY ("masterDataMasterDataTypeName", "masterDataNumber") REFERENCES "MasterData"("masterDataTypeName", "number") ON DELETE SET NULL ON UPDATE CASCADE;
