-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('MIGRATION_SAFETY', 'DATA_INTEGRITY', 'PERFORMANCE_IMPACT', 'PROJECT_RULES_CONSISTENCY', 'SECURITY_OR_SCALABILITY');

-- CreateEnum
CREATE TYPE "SeverityEnum" AS ENUM ('CRITICAL', 'WARNING', 'POSITIVE');

-- CreateTable
CREATE TABLE "ReviewScore" (
    "id" SERIAL NOT NULL,
    "overallReviewId" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "category" "CategoryEnum" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewIssue" (
    "id" SERIAL NOT NULL,
    "overallReviewId" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "category" "CategoryEnum" NOT NULL,
    "severity" "SeverityEnum" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewScore" ADD CONSTRAINT "ReviewScore_overallReviewId_fkey" FOREIGN KEY ("overallReviewId") REFERENCES "OverallReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewIssue" ADD CONSTRAINT "ReviewIssue_overallReviewId_fkey" FOREIGN KEY ("overallReviewId") REFERENCES "OverallReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
