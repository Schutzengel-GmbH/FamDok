/*
  Warnings:

  - Made the column `surveyId` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "surveyId" SET NOT NULL;
