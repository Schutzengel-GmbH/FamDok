-- DropForeignKey
ALTER TABLE "MasterData" DROP CONSTRAINT "MasterData_userId_fkey";

-- AlterTable
ALTER TABLE "MasterData" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MasterData" ADD CONSTRAINT "MasterData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
