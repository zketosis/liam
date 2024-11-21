import type { DBStructure } from 'src/schema'
import { schemaRbConverter, schemaRbParser } from './schemarb'
import { postgresConverter, postgresParser } from './sql'

type SupportedFormat = 'schemarb' | 'postgres'

// biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
const selectParser = (format: SupportedFormat): any => {
  switch (format) {
    case 'schemarb':
      return schemaRbParser
    case 'postgres':
      return postgresParser
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

// biome-ignore lint/suspicious/noExplicitAny:
const selectConverter = (format: SupportedFormat): any => {
  switch (format) {
    case 'schemarb':
      return schemaRbConverter
    case 'postgres':
      return postgresConverter
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

export const parse = (str: string, format: SupportedFormat): DBStructure => {
  try {
    const parser = selectParser(format)
    const parsedSchema = parser.parse(str)
    const converter = selectConverter(format)
    const dbStructure = converter.convertToDBStructure(parsedSchema)
    return dbStructure
  } catch (_error) {
    throw new Error('Failed to parse schema')
  }
}
