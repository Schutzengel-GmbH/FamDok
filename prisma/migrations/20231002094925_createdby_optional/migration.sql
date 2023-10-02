-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "Family_userId_fkey";

-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
