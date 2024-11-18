import * as v from 'valibot'

export const nodeMetaDataSchema = v.object({
  x: v.number(),
  y: v.number(),
  color: v.string(),
})
