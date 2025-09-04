-- AlterEnum
ALTER TYPE "DataFieldType" ADD VALUE 'TriggerSurvey';

-- AlterTable
ALTER TABLE "DataField" ADD COLUMN     "triggeredSurveyId" TEXT,
ADD COLUMN     "typeForTrigger" "DataFieldType";

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_triggeredSurveyId_fkey" FOREIGN KEY ("triggeredSurveyId") REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
