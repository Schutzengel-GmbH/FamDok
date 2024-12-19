/*
  Warnings:

  - Added the required column `userId` to the `MasterData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MasterData" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MasterData" ADD CONSTRAINT "MasterData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
