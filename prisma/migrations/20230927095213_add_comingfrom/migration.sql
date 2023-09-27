-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "comingFromOptionId" TEXT,
ADD COLUMN     "comingFromOtherValue" TEXT;

-- CreateTable
CREATE TABLE "ComingFromOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ComingFromOption_id_key" ON "ComingFromOption"("id");

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_comingFromOptionId_fkey" FOREIGN KEY ("comingFromOptionId") REFERENCES "ComingFromOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
