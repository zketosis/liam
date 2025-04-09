-- Add resolvedAt and resolutionComment columns to ReviewIssue table
BEGIN;

-- Add resolvedAt column to ReviewIssue table
ALTER TABLE "public"."ReviewIssue"
ADD COLUMN "resolvedAt" timestamp(3) without time zone;

-- Add resolutionComment column to ReviewIssue table
ALTER TABLE "public"."ReviewIssue"
ADD COLUMN "resolutionComment" text;

END;
