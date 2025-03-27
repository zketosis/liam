/*
  Warnings:

  - Added the required column `branchName` to the `OverallReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OverallReview" ADD COLUMN     "branchName" TEXT NOT NULL;
