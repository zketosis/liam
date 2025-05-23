export {
  type Schema,
  type Table,
  type Tables,
  type Columns,
  type Column,
  type Index,
  type Indexes,
  type Relationships,
  type Cardinality,
  type TableGroup,
  type Constraint,
  type Constraints,
  type PrimaryKeyConstraint,
  type ForeignKeyConstraint,
  type UniqueConstraint,
  type CheckConstraint,
  type SchemaOverride,
  columnSchema,
  schemaSchema,
  aTable,
  aColumn,
  aRelationship,
  overrideSchema,
  schemaOverrideSchema,
  tableGroupSchema,
  tableGroupsSchema,
} from './schema/index.js'

export type { ProcessError } from './parser.js'

export { buildSchemaDiff } from './diff/index.js'
export type { ChangeStatus, SchemaDiffItem } from './diff/index.js'
