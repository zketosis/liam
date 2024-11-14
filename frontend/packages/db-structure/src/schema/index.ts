import * as v from 'valibot'

const fieldNameSchema = v.string()

const tableNameSchema = v.string()

const relationshipNameSchema = v.string()

const fieldSchema = v.object({
  name: fieldNameSchema,
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
  fields: v.array(v.string()),
})

const tableSchema = v.object({
  name: tableNameSchema,
  x: v.number(),
  y: v.number(),
  fields: v.array(fieldSchema),
  comment: v.string(),
  indices: v.array(indexSchema),
  color: v.string(),
})

const relationshipSchema = v.object({
  name: relationshipNameSchema,
  startTableName: tableNameSchema,
  startFieldName: fieldNameSchema,
  endTableName: tableNameSchema,
  endFieldName: fieldNameSchema,
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
