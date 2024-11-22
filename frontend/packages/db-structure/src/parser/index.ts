import type { DBStructure } from 'src/schema/index.js'
import { processor as schemarbProcessor } from './schemarb/index.js'
import { processor as prosgresqlProcessor } from './sql/index.js'

type SupportedFormat = 'schemarb' | 'postgres'

// TODO: Add error handling and tests
export const parse = (str: string, format: SupportedFormat): DBStructure => {
  switch (format) {
    case 'schemarb':
      return schemarbProcessor(str)
    case 'postgres':
      return prosgresqlProcessor(str)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
