-- DropForeignKey
ALTER TABLE "OverallReview" DROP CONSTRAINT "OverallReview_projectId_fkey";

-- AlterTable
ALTER TABLE "OverallReview" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OverallReview" ADD CONSTRAINT "OverallReview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
