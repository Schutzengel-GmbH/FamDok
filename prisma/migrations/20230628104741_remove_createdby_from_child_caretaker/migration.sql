/*
  Warnings:

  - You are about to drop the column `userId` on the `Caregiver` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Child` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_userId_fkey";

-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_userId_fkey";

-- AlterTable
ALTER TABLE "Caregiver" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Child" DROP COLUMN "userId";
