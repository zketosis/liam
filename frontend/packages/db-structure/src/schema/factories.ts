import type { DBStructure, Field, Table, Tables } from './dbStructure'

export const aField = (override?: Partial<Field>): Field => ({
  name: 'id',
  type: 'varchar',
  default: null,
  check: null,
  comment: null,
  primary: false,
  unique: false,
  notNull: false,
  increment: false,
  ...override,
})

export const aTable = (override?: Partial<Table>): Table => ({
  name: 'users',
  x: 0,
  y: 0,
  comment: null,
  color: null,
  ...override,
  indices: [],
  fields: override?.fields ?? [aField()],
})

const tables = (override?: Tables): Tables => {
  return (
    override ?? {
      users: aTable({ name: 'users' }),
    }
  )
}

export const aDBStructure = (override?: Partial<DBStructure>): DBStructure => ({
  tables: tables(override?.tables),
  relationships: {},
})
