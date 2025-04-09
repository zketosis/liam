import * as v from 'valibot'
import {
  type DBStructure,
  type TableGroup,
  columnNameSchema,
<<<<<<< HEAD
  columnSchema,
  constraintNameSchema,
  constraintSchema,
=======
>>>>>>> main
  dbStructureSchema,
  tableGroupNameSchema,
  tableGroupSchema,
  tableNameSchema,
} from './dbStructure.js'

const columnOverrideSchema = v.object({
  comment: v.optional(v.nullable(v.string())),
})
export type ColumnOverride = v.InferOutput<typeof columnOverrideSchema>

<<<<<<< HEAD
// Schema for adding constraints to an existing table
const addConstraintsSchema = v.record(constraintNameSchema, constraintSchema)
export type AddConstraints = v.InferOutput<typeof addConstraintsSchema>

// Schema for table overrides including the ability to add columns
const tableOverrideSchema = v.object({
  comment: v.optional(v.nullable(v.string())),
  addColumns: v.optional(addColumnsSchema),
  addConstraints: v.optional(addConstraintsSchema),
=======
const tableOverrideSchema = v.object({
  comment: v.optional(v.nullable(v.string())),
  columns: v.optional(v.record(columnNameSchema, columnOverrideSchema)),
>>>>>>> main
})
export type TableOverride = v.InferOutput<typeof tableOverrideSchema>

// Schema for the entire override structure
export const dbOverrideSchema = v.object({
  overrides: v.object({
    // For overriding properties of existing tables
    tables: v.optional(v.record(tableNameSchema, tableOverrideSchema)),

    // For grouping tables
    tableGroups: v.optional(v.record(tableGroupNameSchema, tableGroupSchema)),
  }),
})

export type DBOverride = v.InferOutput<typeof dbOverrideSchema>

/**
 * Applies override definitions to the existing DB structure.
 * This function will:
<<<<<<< HEAD
 * 1. Apply overrides to existing tables
 * 1.1. Replace comments
 * 1.2. Add new columns
 * 1.3. Add new constraints
 * 2. Add new relationships
=======
 * 1. Apply overrides to existing tables (e.g., replacing comments)
 * 2. Apply overrides to existing columns (e.g., replacing comments)
>>>>>>> main
 * 3. Process and merge table groups from both original structure and overrides
 * @param originalStructure The original DB structure
 * @param override The override definitions
 * @returns The merged DB structure and table grouping information
 */
export function applyOverrides(
  originalStructure: DBStructure,
  override: DBOverride,
): { dbStructure: DBStructure; tableGroups: Record<string, TableGroup> } {
  const result = v.parse(
    dbStructureSchema,
    JSON.parse(JSON.stringify(originalStructure)),
  )

  const { overrides } = override

  // Initialize table groups from the original DB structure if it exists
  const tableGroups: Record<string, TableGroup> = originalStructure.tableGroups
    ? { ...originalStructure.tableGroups }
    : {}

  // Apply table overrides
  if (overrides.tables) {
    for (const [tableName, tableOverride] of Object.entries(overrides.tables)) {
      if (!result.tables[tableName]) {
        throw new Error(`Cannot override non-existent table: ${tableName}`)
      }

      // Override table comment if provided
      if (tableOverride.comment !== undefined) {
        result.tables[tableName].comment = tableOverride.comment
      }

      if (tableOverride.columns) {
        for (const [columnName, columnOverride] of Object.entries(
          tableOverride.columns,
        )) {
          if (!result.tables[tableName].columns[columnName]) {
            throw new Error(
              `Cannot override non-existent column ${columnName} in table ${tableName}`,
            )
          }

          if (columnOverride.comment !== undefined) {
            result.tables[tableName].columns[columnName].comment =
              columnOverride.comment
          }
        }
      }

      // Add new constraints
      if (tableOverride.addConstraints) {
        for (const [constraintName, constraint] of Object.entries(
          tableOverride.addConstraints,
        )) {
          if (result.tables[tableName].constraints[constraintName]) {
            throw new Error(
              `Constraint ${constraintName} already exists in the database structure`,
            )
          }
          result.tables[tableName].constraints[constraintName] = constraint
        }
      }
    }
  }

  // Process table groups
  if (overrides.tableGroups) {
    for (const [groupName, groupDefinition] of Object.entries(
      overrides.tableGroups,
    )) {
      // Validate tables exist
      for (const tableName of groupDefinition.tables) {
        if (!result.tables[tableName]) {
          throw new Error(
            `Cannot add non-existent table ${tableName} to group ${groupName}`,
          )
        }
      }

      tableGroups[groupName] = groupDefinition
    }
  }

  // Set table groups to the result DB structure
  result.tableGroups = tableGroups

  return { dbStructure: result, tableGroups }
}
