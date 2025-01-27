import type {
  Columns,
  Indices,
  Relationship,
  Tables,
} from '../../schema/index.js'
import { aColumn, aRelationship, aTable, anIndex } from '../../schema/index.js'
import type { ProcessResult, Processor } from '../types.js'
import { defaultRelationshipName } from '../utils/index.js'
import schema from './schema.generated.js'

async function parseTblsSchema(schemaString: string): Promise<ProcessResult> {
  const parsedSchema = JSON.parse(schemaString)
  const result = schema.safeParse(parsedSchema)

  if (!result.success) {
    return {
      value: {
        tables: {},
        relationships: {},
      },
      errors: [new Error(`Invalid schema format: ${result.error}`)],
    }
  }

  const tables: Tables = {}
  const relationships: Record<string, Relationship> = {}
  const errors: Error[] = []

  for (const tblsTable of result.data.tables) {
    const columns: Columns = {}
    const indices: Indices = {}

    for (const tblsColumn of tblsTable.columns) {
      columns[tblsColumn.name] = aColumn({
        name: tblsColumn.name,
        type: tblsColumn.type,
        notNull: !tblsColumn.nullable,
        default: tblsColumn.default ?? null,
        comment: tblsColumn.comment ?? null,
      })
    }

    if (tblsTable.indexes) {
      for (const tblsIndex of tblsTable.indexes) {
        indices[tblsIndex.name] = anIndex({
          name: tblsIndex.name,
          columns: tblsIndex.columns,
          unique: tblsIndex.def.toLowerCase().includes('unique'),
        })
      }
    }

    tables[tblsTable.name] = aTable({
      name: tblsTable.name,
      columns,
      indices,
      comment: tblsTable.comment ?? null,
    })
  }

  if (result.data.relations) {
    for (const relation of result.data.relations) {
      if (!relation.parent_columns[0] || !relation.columns[0]) {
        continue
      }

      const name = defaultRelationshipName(
        relation.parent_table,
        relation.parent_columns[0],
        relation.table,
        relation.columns[0],
      )

      relationships[name] = aRelationship({
        name,
        primaryTableName: relation.parent_table,
        primaryColumnName: relation.parent_columns[0],
        foreignTableName: relation.table,
        foreignColumnName: relation.columns[0],
        deleteConstraint: 'NO_ACTION',
        updateConstraint: 'NO_ACTION',
      })
    }
  }

  return {
    value: {
      tables,
      relationships,
    },
    errors,
  }
}

export const processor: Processor = (str) => parseTblsSchema(str)
