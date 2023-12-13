/*
  Warnings:

  - The primary key for the `Configuration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Configuration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Configuration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "Configuration_pkey" PRIMARY KEY ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_name_key" ON "Configuration"("name");
