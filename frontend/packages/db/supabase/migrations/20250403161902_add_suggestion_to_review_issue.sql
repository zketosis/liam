-- Add suggestion column to ReviewIssue table
ALTER TABLE "public"."ReviewIssue"
ADD COLUMN "suggestion" text;
