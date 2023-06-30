-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CONTROLLER', 'ORGCONTROLLER', 'USER');

-- CreateEnum
CREATE TYPE "Disability" AS ENUM ('Yes', 'No', 'Impending', 'None', 'Unknown');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('None', 'Unknown', 'Hauptschulabschluss', 'Realschulabschluss', 'Fachhochschulreife', 'Abitur', 'Berufsausbildung', 'UniversityDegree', 'Higher', 'Other');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other', 'Unknown');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('Text', 'Bool', 'Int', 'Num', 'Select', 'Date', 'Scale');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "organizationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT,
    "organizationId" TEXT,
    "name" TEXT,
    "description" TEXT,
    "hasFamily" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "QuestionType" NOT NULL,
    "questionTitle" TEXT,
    "questionText" TEXT NOT NULL,
    "questionDescription" TEXT,
    "selectMultiple" BOOLEAN,
    "intRange" BOOLEAN,
    "intRangeLow" INTEGER,
    "intRangeHigh" INTEGER,
    "numRange" BOOLEAN,
    "numRangeLow" DOUBLE PRECISION,
    "numRangeHigh" DOUBLE PRECISION,
    "surveyId" TEXT,
    "defaultAnswerText" TEXT,
    "defaultAnswerBool" BOOLEAN,
    "defaultAnswerInt" INTEGER,
    "defaultAnswerNum" DOUBLE PRECISION,
    "defaultAnswerDate" TIMESTAMP(3),

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectOption" (
    "id" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "SelectOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surveyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyId" TEXT,
    "childId" TEXT,
    "caregiverId" TEXT,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "answerText" TEXT,
    "answerBool" BOOLEAN,
    "answerInt" INTEGER,
    "answerNum" DOUBLE PRECISION,
    "answerSelectOtherValues" JSONB,
    "answerDate" TIMESTAMP(3),
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "childrenInHousehold" INTEGER,
    "beginOfCare" TIMESTAMP(3) NOT NULL,
    "endOfCare" TIMESTAMP(3),
    "location" TEXT,
    "otherInstalledProfessionals" TEXT,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caregiver" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "familyId" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender" NOT NULL DEFAULT 'Unknown',
    "migrationBackground" BOOLEAN,
    "education" "Education",
    "disability" "Disability",
    "psychDiagosis" BOOLEAN,

    CONSTRAINT "Caregiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "familyId" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'Unknown',
    "beginOfCare" TIMESTAMP(3),
    "endOfCare" TIMESTAMP(3),
    "dateOfBirth" TIMESTAMP(3),
    "disability" "Disability",
    "psychDiagosis" BOOLEAN,
    "isMultiple" BOOLEAN,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DefaultSelectOptionQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerToSelectOption" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Family_number_key" ON "Family"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_number_key" ON "Caregiver"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Child_number_key" ON "Child"("number");

-- CreateIndex
CREATE UNIQUE INDEX "_DefaultSelectOptionQuestion_AB_unique" ON "_DefaultSelectOptionQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_DefaultSelectOptionQuestion_B_index" ON "_DefaultSelectOptionQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerToSelectOption_AB_unique" ON "_AnswerToSelectOption"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerToSelectOption_B_index" ON "_AnswerToSelectOption"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectOption" ADD CONSTRAINT "SelectOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultSelectOptionQuestion" ADD CONSTRAINT "_DefaultSelectOptionQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultSelectOptionQuestion" ADD CONSTRAINT "_DefaultSelectOptionQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "SelectOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToSelectOption" ADD CONSTRAINT "_AnswerToSelectOption_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToSelectOption" ADD CONSTRAINT "_AnswerToSelectOption_B_fkey" FOREIGN KEY ("B") REFERENCES "SelectOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
