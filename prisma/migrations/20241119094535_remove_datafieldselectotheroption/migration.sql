/*
  Warnings:

  - You are about to drop the `DataFieldSelectOtherOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DataFieldSelectOtherOption" DROP CONSTRAINT "DataFieldSelectOtherOption_dataFieldAnswerId_fkey";

-- DropForeignKey
ALTER TABLE "DataFieldSelectOtherOption" DROP CONSTRAINT "DataFieldSelectOtherOption_dataFieldSelectOptionId_fkey";

-- DropTable
DROP TABLE "DataFieldSelectOtherOption";
