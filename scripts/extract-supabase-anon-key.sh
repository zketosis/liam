#!/bin/bash

# Execute the supabase status command and capture its output
STATUS_OUTPUT=$(pnpm --filter @liam-hq/db exec supabase status)

# Extract the first anon key from the output
# Using a more precise grep pattern to match only the anon key line
ANON_KEY_LINE=$(echo "$STATUS_OUTPUT" | grep -m 1 "anon key:")

# Clean up and extract just the key
# Remove "anon key: " prefix
ANON_KEY=$(echo "$ANON_KEY_LINE" | sed 's/.*anon key: \(.*\)/\1/' | tr -d ' ')

if [ -z "$ANON_KEY" ]; then
  echo "Failed to extract the anon key from Supabase status output"
  exit 1
fi

echo "Extracted anon key: $ANON_KEY"

# Check if .env file exists
if [ ! -f .env ]; then
  echo "error: .env file does not exist"
  exit 1
fi

# Check if NEXT_PUBLIC_SUPABASE_ANON_KEY already exists in .env
if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env; then
  # Replace the existing line
  sed -i.bak "s/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY/" .env
  rm -f .env.bak
  echo "Updated NEXT_PUBLIC_SUPABASE_ANON_KEY in .env file"
else
  # Append the new line
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY" >> .env
  echo "Added NEXT_PUBLIC_SUPABASE_ANON_KEY to .env file"
fi