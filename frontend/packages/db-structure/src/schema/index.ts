import * as v from 'valibot'

const fieldSchema = v.object({
  name: v.string(),
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
  name: v.string(),
  x: v.number(),
  y: v.number(),
  fields: v.array(fieldSchema),
  comment: v.string(),
  indices: v.array(indexSchema),
  color: v.string(),
})

const relationshipSchema = v.object({
  name: v.string(),
  startTableName: v.number(),
  startFieldName: v.number(),
  endTableName: v.number(),
  endFieldName: v.number(),
  cardinality: v.string(),
  updateConstraint: v.string(),
  deleteConstraint: v.string(),
})

const tablesSchema = v.record(v.string(), tableSchema) // Key is table name

const relationshipsSchema = v.record(v.string(), relationshipSchema) // Key is relationship name

export const dbStructureSchema = v.object({
  tables: tablesSchema,
  relationships: relationshipsSchema,
})

export type DBStructure = v.InferOutput<typeof dbStructureSchema>
