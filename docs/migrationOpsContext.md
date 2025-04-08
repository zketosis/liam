# Migration Operations Context

Our project uses Supabase Branching for database migration management. This system integrates with our GitHub repository and automatically applies migrations when pull requests are merged to the main branch.

## Deployment System

- Supabase Branching automatically runs migrations when PRs merge to main.
- Migrations in `frontend/packages/db/supabase/migrations` run sequentially by timestamp.

## Key Constraints

- No guaranteed order between app deployments and migrations.
- Either app (`@liam-hq/app`, `@liam-hq/jobs`) or migrations may complete first.
- Migrations must be backward compatible with the previous app version.
- App must work with both old and new database schema.

## Branching Workflow

- Preview branches created automatically for PRs.
- Each commit with migration changes triggers runs on preview instance.
- Schema drift possible between multiple preview branches.

## Safety Practices

- Test all migrations thoroughly in preview branches.
- Design for race conditions between app and database deployments.
- Keep migrations small and focused.
- Regularly merge from main to prevent schema divergence.
- Monitor PR comments for deployment status.

## Create migration

This project uses the migrations provided by the Supabase CLI.

### Creating a migration file

Given the context of the user's message, create a database migration file inside the folder `frontend/packages/db/supabase/migrations/`.

The file MUST following this naming convention:

The file MUST be named in the format `YYYYMMDDHHmmss_short_description.sql` with proper casing for months, minutes, and seconds in UTC time:

1. `YYYY` - Four digits for the year (e.g., `2024`).
2. `MM` - Two digits for the month (01 to 12).
3. `DD` - Two digits for the day of the month (01 to 31).
4. `HH` - Two digits for the hour in 24-hour format (00 to 23).
5. `mm` - Two digits for the minute (00 to 59).
6. `ss` - Two digits for the second (00 to 59).
7. Add an appropriate description for the migration.

For example:

```
20240906123045_create_profiles.sql
```

## SQL Guidelines

Write Postgres-compatible SQL code for Supabase migration files that:

- Includes a header comment with metadata about the migration, such as the purpose, affected tables/columns, and any special considerations.
- Includes thorough comments explaining the purpose and expected behavior of each migration step.
- Write all SQL in lowercase.
- Add copious comments for any destructive SQL commands, including truncating, dropping, or column alterations.
- **Follow the schema design patterns and rules documented in [`docs/schemaPatterns.md`](./schemaPatterns.md)** for consistent database design.

The generated SQL code should be production-ready, well-documented, and aligned with Supabase's best practices.
