# Reusable patterns and rules for database schema design

## General

- Use lowercase for SQL reserved words to maintain consistency and readability.
- Employ consistent, descriptive identifiers for tables, columns, and other database objects.
- Use white space and indentation to enhance the readability of your code.
- Store dates in ISO 8601 format (`yyyy-mm-ddThh:mm:ss.sssss`).
- Include comments for complex logic, using `/* ... */` for block comments and `--` for line comments.

## Naming Conventions

- All database identifiers (table names, column names, foreign key names, and indexes) must follow snake_case formatting.

### Tables

- All table names should be pluralized (e.g., `knowledge_suggestion_doc_mappings`).
- Avoid prefixes like 'tbl' and ensure no table name matches any of its column names.
- Always add an `id` column of type `identity generated always` unless otherwise specified.
- Create all tables in the `public` schema unless otherwise specified.
- Always add the schema to SQL queries for clarity.
- Always add a comment to describe what the table does. The comment can be up to 1024 characters.

### Columns

- Use singular names.
- For references to foreign tables, use the singular of the table name with the `id` suffix. For example `user_id` to reference the `users` table

### Timestamp Column Guidelines

- All timestamp columns MUST utilize the `timestamptz` data type to include time zone information.
- This practice ensures consistency in date-time storage and supports global operations.
- ORM configurations and deployment procedures must be reviewed to align with this requirement.

#### Examples

```sql
create table "public"."books" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text not null,
  "author_id" uuid references "public"."authors" (id)
);
comment on table "public"."books" is 'A list of all the books in the library.';
```

## Structural Modeling Patterns

- Models should clearly define foreign key relationships with appropriate constraints to maintain referential integrity.

## Preferred Types

- Use ENUM types for fields that have a limited set of valid values, such as categories and severities, to promote consistency.
