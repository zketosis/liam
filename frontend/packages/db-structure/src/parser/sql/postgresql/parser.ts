import type { RawStmt } from '@pgsql/types'
import { parse as postgresParse } from 'pgsql-parser'

export const parse = (str: string): RawStmtWrapper[] => {
  return postgresParse(str)
}

// It was expected that postgresParse would return a ParseResult object,
// but it was found that an array of RawStmtWrapper objects was returned.
export interface RawStmtWrapper {
  RawStmt: RawStmt
}
