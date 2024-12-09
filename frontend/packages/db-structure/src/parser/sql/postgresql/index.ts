import type { DBStructure } from '../../../schema/index.js'
import type { Processor } from '../../types.js'
import { convertToDBStructure } from './converter.js'
import { mergeDBStructures } from './mergeDBStructures.js'
import { parse } from './parser.js'
import { processSQLInChunks } from './processSQLInChunks.js'

export const processor: Processor = async (str: string) => {
  const dbStructure: DBStructure = { tables: {}, relationships: {} }
  const CHUNK_SIZE = 1000

  await processSQLInChunks(str, CHUNK_SIZE, async (chunk) => {
    const parsed = await parse(chunk)
    const partial = convertToDBStructure(parsed)
    mergeDBStructures(dbStructure, partial)
  })

  return { value: dbStructure, errors: [] }
}
