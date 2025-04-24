
BEGIN;

CREATE TABLE IF NOT EXISTS "public"."overall_review_pull_request_mappings" (
  "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
  "overall_review_id" "uuid" NOT NULL,
  "pull_request_id" "uuid" NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp(3) with time zone NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "overall_review_pull_request_mapping_overall_review_id_pull_request_id_key" UNIQUE ("overall_review_id", "pull_request_id")
);

ALTER TABLE "public"."overall_review_pull_request_mappings"
  ADD CONSTRAINT "overall_review_pull_request_mapping_overall_review_id_fkey"
  FOREIGN KEY ("overall_review_id") REFERENCES "public"."overall_reviews"("id")
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."overall_review_pull_request_mappings"
  ADD CONSTRAINT "overall_review_pull_request_mapping_pull_request_id_fkey"
  FOREIGN KEY ("pull_request_id") REFERENCES "public"."github_pull_requests"("id")
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."overall_reviews"
  ADD COLUMN "migration_id" "uuid";

UPDATE "public"."overall_reviews" o
SET "migration_id" = (
  SELECT m.id
  FROM "public"."migrations" m
  JOIN "public"."migration_pull_request_mappings" mpr ON m.id = mpr.migration_id
  WHERE mpr.pull_request_id = o.pull_request_id
  LIMIT 1
);

DELETE FROM "public"."overall_reviews" WHERE "migration_id" IS NULL;

INSERT INTO "public"."overall_review_pull_request_mappings" ("overall_review_id", "pull_request_id", "updated_at")
SELECT "id", "pull_request_id", CURRENT_TIMESTAMP
FROM "public"."overall_reviews";

ALTER TABLE "public"."overall_reviews"
  ALTER COLUMN "migration_id" SET NOT NULL;

ALTER TABLE "public"."overall_reviews"
  ADD CONSTRAINT "overall_review_migration_id_fkey"
  FOREIGN KEY ("migration_id") REFERENCES "public"."migrations"("id")
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "public"."overall_reviews"
  DROP CONSTRAINT IF EXISTS "overall_review_pull_request_id_fkey";

ALTER TABLE "public"."overall_reviews"
  DROP COLUMN "pull_request_id";

ALTER TABLE "public"."overall_reviews"
  DROP COLUMN "project_id";

COMMIT;
