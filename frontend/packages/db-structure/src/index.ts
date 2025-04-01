export {
  type DBStructure,
  type Table,
  type Tables,
  type Columns,
  type Column,
  type Index,
  type Indexes,
  type Relationships,
  type Cardinality,
  type TableGroup,
  type DBOverride,
  dbStructureSchema,
  aTable,
  aColumn,
  aRelationship,
  applyOverrides,
  dbOverrideSchema,
} from './schema/index.js'

export type { ProcessError } from './parser.js'
