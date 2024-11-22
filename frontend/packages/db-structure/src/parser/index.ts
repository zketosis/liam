import type { DBStructure } from 'src/schema/index.js'
import * as schemaRbParserAndConverter from './schemarb/index.js'
import { processor as prosgresqlProcessor } from './sql/index.js'

type SupportedFormat = 'schemarb' | 'postgres'

type Parser = (str: string) => DBStructure

const parseSchemarb: Parser = (str) => {
  const parsed = schemaRbParserAndConverter.parser.parse(str)
  return schemaRbParserAndConverter.converter.convertToDBStructure(parsed)
}

// TODO: Add error handling and tests
export const parse = (str: string, format: SupportedFormat): DBStructure => {
  switch (format) {
    case 'schemarb':
      return parseSchemarb(str)
    case 'postgres':
      return prosgresqlProcessor(str)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
