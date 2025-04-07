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