-- Add unique constraint on projectId to enforce 1:1 relationship between Project and GitHubSchemaFilePath
CREATE UNIQUE INDEX "GitHubSchemaFilePath_projectId_key" ON "public"."GitHubSchemaFilePath" USING "btree" ("projectId");

-- Note: Before applying this migration, you may need to clean up existing data
-- to ensure there's only one GitHubSchemaFilePath per Project.
-- You can use the following query to identify projects with multiple schema paths:

-- SELECT "projectId", COUNT(*)
-- FROM "public"."GitHubSchemaFilePath"
-- GROUP BY "projectId"
-- HAVING COUNT(*) > 1;

-- And then decide which ones to keep, for example keeping the most recently created one:

-- WITH ranked_paths AS (
--   SELECT
--     id,
--     "projectId",
--     ROW_NUMBER() OVER (PARTITION BY "projectId" ORDER BY "createdAt" DESC) as rn
--   FROM "public"."GitHubSchemaFilePath"
-- )
-- DELETE FROM "public"."GitHubSchemaFilePath"
-- WHERE id IN (
--   SELECT id FROM ranked_paths WHERE rn > 1
-- );
--