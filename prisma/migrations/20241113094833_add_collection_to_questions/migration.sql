-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'Collection';

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "collectionId" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "collectionSize" INTEGER;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
