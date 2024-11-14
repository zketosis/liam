import * as v from 'valibot'

const fieldSchema = v.object({
  id: v.number(),
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
  id: v.number(),
  name: v.string(),
  unique: v.boolean(),
  fields: v.array(v.string()),
})

const tableSchema = v.object({
  id: v.number(),
  name: v.string(),
  x: v.number(),
  y: v.number(),
  fields: v.array(fieldSchema),
  comment: v.string(),
  indices: v.array(indexSchema),
  color: v.string(),
})

const relationshipSchema = v.object({
  id: v.number(),
  name: v.string(),
  startTableId: v.number(),
  startFieldId: v.number(),
  endTableId: v.number(),
  endFieldId: v.number(),
  cardinality: v.string(),
  updateConstraint: v.string(),
  deleteConstraint: v.string(),
})

const tablesSchema = v.record(v.string(), tableSchema)

const relationshipsSchema = v.record(v.string(), relationshipSchema)

export const dbStructureSchema = v.object({
  tables: tablesSchema,
  relationships: relationshipsSchema,
})

export type DBStructure = v.InferOutput<typeof dbStructureSchema>
