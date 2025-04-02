ALTER TABLE "public"."KnowledgeSuggestion" ADD COLUMN IF NOT EXISTS "traceId" text;

ALTER TABLE "public"."OverallReview" ADD COLUMN IF NOT EXISTS "traceId" text;
