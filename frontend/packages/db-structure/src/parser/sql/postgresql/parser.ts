import type { RawStmt } from '@pgsql/types'
import { parse } from 'pgsql-parser'

export const postgresParser = {
  parse(str: string): RawStmtWrapper[] {
    return parse(str)
  },
}
export interface RawStmtWrapper {
  RawStmt: RawStmt
}
