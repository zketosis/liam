import * as v from 'valibot'

const columnNameSchema = v.string()

const tableNameSchema = v.string()

const relationshipNameSchema = v.string()

const columnSchema = v.object({
  name: columnNameSchema,
  type: v.string(),
  default: v.string(),
  check: v.string(),
  primary: v.boolean(),
  unique: v.boolean(),
  notNull: v.boolean(),
  increment: v.boolean(),
  comment: v.string(),
})

const indexSchema = v.object({
  name: v.string(),
  unique: v.boolean(),
  columns: v.array(v.string()),
})

const tableSchema = v.object({
  name: tableNameSchema,
  x: v.number(),
  y: v.number(),
  columns: v.array(columnSchema),
  comment: v.nullable(v.string()),
  indices: v.array(indexSchema),
  color: v.nullable(v.string()),
})

export type Table = v.InferOutput<typeof tableSchema>

const relationshipSchema = v.object({
  name: relationshipNameSchema,
  startTableName: tableNameSchema,
  startColumnName: columnNameSchema,
  endTableName: tableNameSchema,
  endColumnName: columnNameSchema,
  cardinality: v.string(),
  updateConstraint: v.string(),
  deleteConstraint: v.string(),
})

const tablesSchema = v.record(tableNameSchema, tableSchema)

const relationshipsSchema = v.record(relationshipNameSchema, relationshipSchema)

export const dbStructureSchema = v.object({
  tables: tablesSchema,
  relationships: relationshipsSchema,
})

export type DBStructure = v.InferOutput<typeof dbStructureSchema>
