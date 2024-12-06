import {
  type Table,
  aColumn,
  aDBStructure,
  aTable,
} from '../../schema/index.js'

const userTable = (override?: Partial<Table>) =>
  aDBStructure({
    tables: {
      users: aTable({
        name: 'users',
        columns: {
          id: aColumn({
            name: 'id',
            type: 'bigserial',
            notNull: true,
            primary: true,
            unique: true,
          }),
          ...override?.columns,
        },
        indices: {
          ...override?.indices,
        },
        comment: override?.comment ?? null,
      }),
    },
  })

export const parserTestCases = {
  'table comment': userTable({
    comment: 'store our users.',
  }),
  'not null': userTable({
    columns: {
      name: aColumn({
        name: 'name',
        type: 'varchar',
        notNull: true,
      }),
    },
  }),
  nullable: userTable({
    columns: {
      description: aColumn({
        name: 'description',
        type: 'text',
        notNull: false,
      }),
    },
  }),
  'default value as string': userTable({
    columns: {
      description: aColumn({
        name: 'description',
        type: 'text',
        default: "user's description",
      }),
    },
  }),
  'default value as integer': userTable({
    columns: {
      age: aColumn({
        name: 'age',
        type: 'int4',
        default: 30,
      }),
    },
  }),
}
