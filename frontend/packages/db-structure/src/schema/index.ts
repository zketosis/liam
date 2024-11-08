import * as v from 'valibot'

const tablesSchema = v.object({})

export const dbStructureSchema = v.object({
  tables: tablesSchema,
})

export type DBStructure = v.InferOutput<typeof dbStructureSchema>
