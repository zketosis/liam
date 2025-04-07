# Reusable patterns and rules for database schema design

## Structural Modeling Patterns
- Models should clearly define foreign key relationships with appropriate constraints to maintain referential integrity.

## Preferred Types
- Use ENUM types for fields that have a limited set of valid values, such as categories and severities, to promote consistency.

## Naming Conventions
- All table names should be singular (e.g., `KnowledgeSuggestionDocMapping`), using UpperCamelCase.
- Fields should use lowerCamelCase for naming, ensuring clarity and consistency across the schema.