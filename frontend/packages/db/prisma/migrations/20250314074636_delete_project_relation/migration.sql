/*
  Warnings:

  - You are about to drop the column `projectId` on the `Migration` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Migration" DROP CONSTRAINT "Migration_projectId_fkey";

-- AlterTable
ALTER TABLE "Migration" DROP COLUMN "projectId";
