import type { Column, Schema, Table } from '@liam-hq/db-structure'
import type { SchemaData } from '../../../../../app/api/chat/route'

// 1. Helper function to adapt columns
function adaptColumns(columns: Record<string, Column>) {
  const adaptedColumns: Record<
    string,
    {
      type: string
      nullable: boolean
      description: string | undefined
    }
  > = {}
  const primaryKeyColumns: string[] = []

  for (const [columnName, columnData] of Object.entries(columns)) {
    adaptedColumns[columnName] = {
      type: columnData.type,
      nullable: !columnData.notNull,
      description: columnData.comment || undefined,
    }

    if (columnData.primary) {
      primaryKeyColumns.push(columnName)
    }
  }

  return { adaptedColumns, primaryKeyColumns }
}

// 2. Helper function to adapt tables
function adaptTables(tables: Record<string, Table> = {}) {
  const adaptedTables: Record<
    string,
    {
      description: string | undefined
      columns: Record<
        string,
        {
          type: string
          nullable: boolean
          description: string | undefined
        }
      >
      primaryKey: { columns: string[] }
    }
  > = {}

  for (const [tableName, tableData] of Object.entries(tables)) {
    const { adaptedColumns, primaryKeyColumns } = adaptColumns(
      tableData.columns || {},
    )

    adaptedTables[tableName] = {
      description: tableData.comment || undefined,
      columns: adaptedColumns,
      primaryKey: { columns: primaryKeyColumns },
    }
  }

  return adaptedTables
}

// Define a type for relationships based on the schema structure
type RelationshipType = {
  primaryTableName: string
  primaryColumnName: string
  foreignTableName: string
  foreignColumnName: string
  cardinality: 'ONE_TO_ONE' | 'ONE_TO_MANY'
}

// 3. Helper function to adapt relationships
function adaptRelationships(
  relationships: Record<string, RelationshipType> = {},
) {
  const adaptedRelationships: Record<
    string,
    {
      fromTable: string
      fromColumn: string
      toTable: string
      toColumn: string
      type: 'ONE_TO_ONE' | 'ONE_TO_MANY'
    }
  > = {}

  for (const [relationshipName, relationshipData] of Object.entries(
    relationships,
  )) {
    adaptedRelationships[relationshipName] = {
      fromTable: relationshipData.primaryTableName,
      fromColumn: relationshipData.primaryColumnName,
      toTable: relationshipData.foreignTableName,
      toColumn: relationshipData.foreignColumnName,
      type: relationshipData.cardinality,
    }
  }

  return adaptedRelationships
}

// Main function with reduced complexity
export function adaptSchemaForChatbot(schema: Schema): SchemaData {
  return {
    tables: adaptTables(schema.tables),
    relationships: adaptRelationships(schema.relationships),
    tableGroups: schema.tableGroups,
  }
}

// For backward compatibility with existing code
export type ERDSchema = Schema
