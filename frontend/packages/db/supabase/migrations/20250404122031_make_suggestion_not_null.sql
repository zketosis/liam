-- Update existing null values to empty string
UPDATE "public"."ReviewIssue"
SET "suggestion" = ''
WHERE "suggestion" IS NULL;

-- Alter suggestion column to NOT NULL
ALTER TABLE "public"."ReviewIssue"
ALTER COLUMN "suggestion" SET NOT NULL;
