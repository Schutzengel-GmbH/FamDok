/*
  Warnings:

  - You are about to drop the column `dependencyTest` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isDependent` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "dependencyTest",
DROP COLUMN "isDependent";
