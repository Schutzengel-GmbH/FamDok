-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('System', 'Dark', 'Light');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'System';
