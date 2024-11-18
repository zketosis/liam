import * as v from 'valibot'
import { relationshipsSchema, tableNameSchema, tableSchema } from './database'
import { nodeMetaDataSchema } from './erd'

const nodeTableSchema = v.object({
  ...tableSchema.entries,
  ...nodeMetaDataSchema.entries,
})

const nodeTablesSchema = v.record(tableNameSchema, nodeTableSchema)

export const erdStructureSchema = v.object({
  tables: nodeTablesSchema,
  relationships: relationshipsSchema,
})

export type ERDStructure = v.InferOutput<typeof erdStructureSchema>
