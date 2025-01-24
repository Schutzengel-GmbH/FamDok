-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "dependencyTest" JSONB,
ADD COLUMN     "isDependent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "_AnswerToSelectOption" ADD CONSTRAINT "_AnswerToSelectOption_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnswerToSelectOption_AB_unique";

-- AlterTable
ALTER TABLE "_DataFieldAnswerToDataFieldSelectOption" ADD CONSTRAINT "_DataFieldAnswerToDataFieldSelectOption_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DataFieldAnswerToDataFieldSelectOption_AB_unique";

-- AlterTable
ALTER TABLE "_DataFieldToDataFieldSelectOption" ADD CONSTRAINT "_DataFieldToDataFieldSelectOption_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DataFieldToDataFieldSelectOption_AB_unique";

-- AlterTable
ALTER TABLE "_DefaultSelectOptionQuestion" ADD CONSTRAINT "_DefaultSelectOptionQuestion_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DefaultSelectOptionQuestion_AB_unique";

-- AlterTable
ALTER TABLE "_SubOrganizationToUser" ADD CONSTRAINT "_SubOrganizationToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SubOrganizationToUser_AB_unique";
