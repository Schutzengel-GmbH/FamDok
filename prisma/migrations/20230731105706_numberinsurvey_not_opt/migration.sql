/*
  Warnings:

  - Made the column `numberInSurvey` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "numberInSurvey" SET NOT NULL;
