-- Migration to remove the ReviewScore table
-- The score can be calculated from the ReviewIssue's Severity and category

-- Drop the foreign key constraint first
ALTER TABLE "public"."ReviewScore" DROP CONSTRAINT "ReviewScore_overallReviewId_fkey";

-- Drop the table
DROP TABLE "public"."ReviewScore";
