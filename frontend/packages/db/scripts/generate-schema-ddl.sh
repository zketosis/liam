#!/bin/bash

# Set output directory for schema DDL
OUTPUT_DIR="schema"
HOST_OUTPUT_DIR="$(pwd)/${OUTPUT_DIR}"
DOCKER_OUTPUT_DIR="/tmp/${OUTPUT_DIR}"
SCHEMA_FILE="${DOCKER_OUTPUT_DIR}/schema.sql"
mkdir -p $HOST_OUTPUT_DIR

echo "Generating complete schema DDL using pg_dump..."

# Get Supabase database connection info
DB_URL=$(pnpm supabase status | grep "DB URL" | awk '{print $3}')

if [ -z "$DB_URL" ]; then
  echo "Error: Could not retrieve database URL from Supabase"
  echo "Make sure Supabase is running with 'pnpm supabase start'"
  exit 1
fi

# Get Supabase Postgres container image
IMAGE=$(docker ps --format "{{.Image}}" | grep '^public.ecr.aws/supabase/postgres:' | head -1)
if [ -z "${IMAGE}" ]; then
  echo "Error: Could not find Supabase Postgres container"
  exit 1
fi

# Define pg_dump command. Use supabase postgres image for compatibility with pg_dump
PG_DUMP=(
  docker run
  -v "${HOST_OUTPUT_DIR}:${DOCKER_OUTPUT_DIR}"
  --network=host
  --rm
  -e PGPASSWORD=postgres
  "${IMAGE}"
  pg_dump
)

# Use pg_dump to output schema only (no data)
# --schema=public to target only the public schema
# --schema-only to output only schema definitions
# --no-owner to omit ownership information
"${PG_DUMP[@]}" "$DB_URL" \
  --schema=public \
  --schema-only \
  --no-owner \
  --file "$SCHEMA_FILE"

if [ $? -ne 0 ]; then
  echo "Error: pg_dump failed to generate schema DDL"
  exit 1
fi

echo "Schema DDL successfully generated at $HOST_OUTPUT_DIR"
