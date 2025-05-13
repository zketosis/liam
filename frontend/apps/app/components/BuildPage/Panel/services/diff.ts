import type { Schema } from '@liam-hq/db-structure'
import { type Operation, compare } from 'fast-json-patch'

export function diff(before: Schema, after: Schema): Operation[] {
  return compare(before, after)
}
