/*
  Warnings:

  - You are about to drop the column `typeForTrigger` on the `DataField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DataField" DROP COLUMN "typeForTrigger",
ADD COLUMN     "triggerMultiple" BOOLEAN;
