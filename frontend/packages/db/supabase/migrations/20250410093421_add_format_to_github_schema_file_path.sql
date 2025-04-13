-- Start transaction to ensure all operations succeed or fail together
BEGIN;

-- Step 1: Create a new ENUM type for supported formats
CREATE TYPE "public"."SchemaFormatEnum" AS ENUM (
    'schemarb',
    'postgres',
    'prisma',
    'tbls'
);

-- Step 2: Add format column as nullable initially
ALTER TABLE "public"."GitHubSchemaFilePath"
ADD COLUMN "format" "public"."SchemaFormatEnum";

-- Step 3: Update all existing records to 'postgres'
UPDATE "public"."GitHubSchemaFilePath"
SET "format" = 'postgres';

-- Step 4: Add NOT NULL constraint after all records have been updated
ALTER TABLE "public"."GitHubSchemaFilePath"
ALTER COLUMN "format" SET NOT NULL;

-- Commit the transaction
COMMIT;
