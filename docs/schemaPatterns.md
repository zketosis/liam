# Reusable patterns and rules for database schema design

## General

- Use lowercase for SQL reserved words to maintain consistency and readability.
- Employ consistent, descriptive identifiers for tables, columns, and other database objects.
- Use white space and indentation to enhance the readability of your code.
- Store dates in ISO 8601 format (`yyyy-mm-ddThh:mm:ss.sssss`).
- Include comments for complex logic, using `/* ... */` for block comments and `--` for line comments.

## Naming Conventions

- All table names should be singular (e.g., `KnowledgeSuggestionDocMapping`), using UpperCamelCase.
- Fields should use lowerCamelCase for naming, ensuring clarity and consistency across the schema.

### Tables

- Avoid prefixes like 'tbl' and ensure no table name matches any of its column names.
- Always add an `id` column of type `identity generated always` unless otherwise specified.
- Create all tables in the `public` schema unless otherwise specified.
- Always add the schema to SQL queries for clarity.
- Always add a comment to describe what the table does. The comment can be up to 1024 characters.

### Columns

- Use singular names.
- For references to foreign tables, use the singular of the table name with the `id` suffix. For example `userId` to reference the `User` table
- Always use lowercase except in cases involving acronyms or when readability would be enhanced by an exception.

#### Examples

```sql
create table Book (
  id bigint generated always as identity primary key,
  title text not null,
  authorId bigint references Author (id)
);
comment on table Book is 'A list of all the books in the library.';
```

## Structural Modeling Patterns

- Models should clearly define foreign key relationships with appropriate constraints to maintain referential integrity.

## Preferred Types

- Use ENUM types for fields that have a limited set of valid values, such as categories and severities, to promote consistency.
