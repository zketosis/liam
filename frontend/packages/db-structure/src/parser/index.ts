import type { DBStructure } from 'src/schema/index.js'
import * as schemaRbParserAndConverter from './schemarb/index.js'
import * as postgresParserAndConverter from './sql/index.js'

type SupportedFormat = 'schemarb' | 'postgres'

// biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
const selectParser = (format: SupportedFormat): any => {
  switch (format) {
    case 'schemarb':
      return schemaRbParserAndConverter.parser
    case 'postgres':
      return postgresParserAndConverter.perserAndConverter.parser
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

// biome-ignore lint/suspicious/noExplicitAny:
const selectConverter = (format: SupportedFormat): any => {
  switch (format) {
    case 'schemarb':
      return schemaRbParserAndConverter.converter
    case 'postgres':
      return postgresParserAndConverter.perserAndConverter.converter
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
    throw new Error(`Failed to parse schema:${_error}`)
  }
}
