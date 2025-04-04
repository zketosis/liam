-- Add suggestion column to ReviewIssue table and make it NOT NULL
BEGIN;

-- Add suggestion column to ReviewIssue table
ALTER TABLE "public"."ReviewIssue"
ADD COLUMN "suggestion" text;

-- Update existing null values to empty string
UPDATE "public"."ReviewIssue"
SET "suggestion" = ''
WHERE "suggestion" IS NULL;

-- Alter suggestion column to NOT NULL
ALTER TABLE "public"."ReviewIssue"
ALTER COLUMN "suggestion" SET NOT NULL;

END;
