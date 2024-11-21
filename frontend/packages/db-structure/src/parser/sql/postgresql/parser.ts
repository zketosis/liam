import type { RawStmt } from '@pgsql/types'
import { parse as postgresParse } from 'pgsql-parser'

export const parse = (str: string): RawStmtWrapper[] => {
  return postgresParse(str)
}

export interface RawStmtWrapper {
  RawStmt: RawStmt
}
