-- CreateEnum
CREATE TYPE "DataFieldType" AS ENUM ('Text', 'Bool', 'Int', 'Num', 'Select', 'Date');

-- AlterTable
ALTER TABLE "SelectOption" ADD COLUMN     "dataFieldAnswerId" TEXT;

-- CreateTable
CREATE TABLE "MasterDataType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "isLimitedToOrg" BOOLEAN,
    "organizationId" TEXT,

    CONSTRAINT "MasterDataType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterData" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "masterDataTypeId" TEXT NOT NULL,

    CONSTRAINT "MasterData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataField" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "masterDataTypeId" TEXT,
    "type" "DataFieldType" NOT NULL,
    "required" BOOLEAN,
    "text" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DataField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataFieldAnswer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "masterDataId" TEXT,
    "answerText" TEXT,
    "answerBool" BOOLEAN,
    "answerInt" INTEGER,
    "answerNum" DOUBLE PRECISION,
    "answerDate" TIMESTAMP(3),
    "dataFieldId" TEXT NOT NULL,

    CONSTRAINT "DataFieldAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SelectOption" ADD CONSTRAINT "SelectOption_dataFieldAnswerId_fkey" FOREIGN KEY ("dataFieldAnswerId") REFERENCES "DataFieldAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterDataType" ADD CONSTRAINT "MasterDataType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterData" ADD CONSTRAINT "MasterData_masterDataTypeId_fkey" FOREIGN KEY ("masterDataTypeId") REFERENCES "MasterDataType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_masterDataTypeId_fkey" FOREIGN KEY ("masterDataTypeId") REFERENCES "MasterDataType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_masterDataId_fkey" FOREIGN KEY ("masterDataId") REFERENCES "MasterData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_dataFieldId_fkey" FOREIGN KEY ("dataFieldId") REFERENCES "DataField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
