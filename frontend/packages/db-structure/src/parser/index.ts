import * as v from 'valibot'
import type { DBStructure } from '../schema/index.js'
import { processor as schemarbProcessor } from './schemarb/index.js'
import { processor as postgresqlProcessor } from './sql/index.js'

export const supportedFormatSchema = v.union([
  v.literal('schemarb'),
  v.literal('postgres'),
])

export type SupportedFormat = v.InferOutput<typeof supportedFormatSchema>

// TODO: Add error handling and tests
export const parse = (
  str: string,
  format: SupportedFormat,
): Promise<DBStructure> | DBStructure => {
  switch (format) {
    case 'schemarb':
      return schemarbProcessor(str)
    case 'postgres':
      return postgresqlProcessor(str)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
