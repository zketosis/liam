import * as v from 'valibot'
import {
  type DBStructure,
  columnNameSchema,
  columnSchema,
  dbStructureSchema,
  relationshipNameSchema,
  relationshipSchema,
  tableNameSchema,
  tableSchema,
} from './dbStructure.js'

// Schema for table group name
export const tableGroupNameSchema = v.string()

// Schema for table group
export const tableGroupSchema = v.object({
  name: v.string(),
  tables: v.array(tableNameSchema),
  comment: v.nullable(v.string()),
})

export type TableGroup = v.InferOutput<typeof tableGroupSchema>

// Schema for adding columns to an existing table
const addColumnsSchema = v.record(columnNameSchema, columnSchema)
export type AddColumns = v.InferOutput<typeof addColumnsSchema>

// Schema for table overrides including the ability to add columns
const tableOverrideSchema = v.object({
  comment: v.optional(v.nullable(v.string())),
  addColumns: v.optional(addColumnsSchema),
})
export type TableOverride = v.InferOutput<typeof tableOverrideSchema>

// Schema for the entire override structure
export const dbOverrideSchema = v.object({
  overrides: v.object({
    // For adding completely new tables
    addTables: v.optional(v.record(tableNameSchema, tableSchema)),

    // For overriding properties of existing tables
    tables: v.optional(v.record(tableNameSchema, tableOverrideSchema)),

    // For adding new relationships
    addRelationships: v.optional(
      v.record(relationshipNameSchema, relationshipSchema),
    ),

    // For grouping tables
    tableGroups: v.optional(v.record(tableGroupNameSchema, tableGroupSchema)),
  }),
})

export type DBOverride = v.InferOutput<typeof dbOverrideSchema>

/**
 * Applies override definitions to the existing DB structure.
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

  const tableGroups: Record<string, TableGroup> = {}

  // Add new tables
  if (overrides.addTables) {
    for (const [tableName, tableDefinition] of Object.entries(
      overrides.addTables,
    )) {
      if (result.tables[tableName]) {
        throw new Error(
          `Table ${tableName} already exists in the database structure`,
        )
      }
      result.tables[tableName] = tableDefinition
    }
  }

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

      // Add new columns
      if (tableOverride.addColumns) {
        for (const [columnName, columnDefinition] of Object.entries(
          tableOverride.addColumns,
        )) {
          if (result.tables[tableName].columns[columnName]) {
            throw new Error(
              `Column ${columnName} already exists in table ${tableName}`,
            )
          }
          result.tables[tableName].columns[columnName] = columnDefinition
        }
      }
    }
  }

  // Add new relationships
  if (overrides.addRelationships) {
    for (const [relationshipName, relationshipDefinition] of Object.entries(
      overrides.addRelationships,
    )) {
      if (result.relationships[relationshipName]) {
        throw new Error(
          `Relationship ${relationshipName} already exists in the database structure`,
        )
      }

      // Validate that referenced tables and columns exist
      const {
        primaryTableName,
        primaryColumnName,
        foreignTableName,
        foreignColumnName,
      } = relationshipDefinition

      if (!result.tables[primaryTableName]) {
        throw new Error(
          `Primary table ${primaryTableName} does not exist for relationship ${relationshipName}`,
        )
      }

      if (!result.tables[primaryTableName].columns[primaryColumnName]) {
        throw new Error(
          `Primary column ${primaryColumnName} does not exist in table ${primaryTableName} for relationship ${relationshipName}`,
        )
      }

      if (!result.tables[foreignTableName]) {
        throw new Error(
          `Foreign table ${foreignTableName} does not exist for relationship ${relationshipName}`,
        )
      }

      if (!result.tables[foreignTableName].columns[foreignColumnName]) {
        throw new Error(
          `Foreign column ${foreignColumnName} does not exist in table ${foreignTableName} for relationship ${relationshipName}`,
        )
      }

      result.relationships[relationshipName] = relationshipDefinition
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

  return { dbStructure: result, tableGroups }
}
