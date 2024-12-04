-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('Text', 'Int', 'Num', 'Date');

-- AlterEnum
ALTER TYPE "DataFieldType" ADD VALUE 'Collection';

-- AlterTable
ALTER TABLE "DataField" ADD COLUMN     "collectionMaxSize" INTEGER,
ADD COLUMN     "collectionType" "CollectionType";

-- AlterTable
ALTER TABLE "DataFieldAnswer" ADD COLUMN     "collectionId" TEXT;

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "CollectionType" NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionDataString" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionDataString_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionDataInt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionDataInt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionDataFloat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionDataFloat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionDataDate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TIMESTAMP(3) NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionDataDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataFieldAnswer" ADD CONSTRAINT "DataFieldAnswer_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDataString" ADD CONSTRAINT "CollectionDataString_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDataInt" ADD CONSTRAINT "CollectionDataInt_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDataFloat" ADD CONSTRAINT "CollectionDataFloat_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDataDate" ADD CONSTRAINT "CollectionDataDate_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
