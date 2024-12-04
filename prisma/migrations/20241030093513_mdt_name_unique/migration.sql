/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MasterDataType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MasterDataType_name_key" ON "MasterDataType"("name");
