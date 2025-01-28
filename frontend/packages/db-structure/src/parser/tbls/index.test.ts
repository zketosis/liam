import { describe, expect, it } from 'vitest'
import type { Table } from '../../schema/index.js'
import { aColumn, aDBStructure, aTable } from '../../schema/index.js'
import { processor } from './index.js'

describe(processor, () => {
  const userTable = (override?: Partial<Table>) =>
    aDBStructure({
      tables: {
        users: aTable({
          name: 'users',
          columns: {
            id: aColumn({
              name: 'id',
              type: 'int',
              notNull: true,
              primary: false,
              unique: false,
            }),
            ...override?.columns,
          },
        }),
      },
    })

  describe('should parse tbls schema correctly', () => {
    it('not null', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable()

      expect(value).toEqual(expected)
    })

    it('nullable', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: true,
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          id: aColumn({
            name: 'id',
            type: 'int',
            notNull: false,
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('not unique', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
                {
                  name: 'email',
                  type: 'text',
                  nullable: true,
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          email: aColumn({
            name: 'email',
            type: 'text',
            unique: false,
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('unique', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
                {
                  name: 'email',
                  type: 'text',
                  nullable: true,
                },
              ],
              constraints: [
                {
                  name: 'users_email_key',
                  type: 'UNIQUE',
                  def: 'UNIQUE KEY users_email_key (email)',
                  table: 'users',
                  columns: ['email'],
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          email: aColumn({
            name: 'email',
            type: 'text',
            unique: true,
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('primary key', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
              ],
              constraints: [
                {
                  name: 'users_pkey',
                  type: 'PRIMARY KEY',
                  def: 'PRIMARY KEY (id)',
                  table: 'users',
                  columns: ['id'],
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          id: aColumn({
            name: 'id',
            type: 'int',
            primary: true,
            notNull: true,
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('default value as string', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                  default: "nextval('users_id_seq'::regclass)",
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          id: aColumn({
            name: 'id',
            type: 'int',
            notNull: true,
            default: "nextval('users_id_seq'::regclass)",
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('default value as integer', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
                {
                  name: 'age',
                  type: 'int',
                  nullable: false,
                  // NOTE: tblsColumn.default is of type string | null | undefined
                  default: '30',
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          id: aColumn({
            name: 'id',
            type: 'int',
            notNull: true,
          }),
          age: aColumn({
            name: 'age',
            type: 'int',
            notNull: true,
            default: 30,
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('default value as boolean', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
                {
                  name: 'active',
                  type: 'bool',
                  nullable: false,
                  // NOTE: tblsColumn.default is of type string | null | undefined
                  default: 'true',
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          id: aColumn({
            name: 'id',
            type: 'int',
            notNull: true,
          }),
          active: aColumn({
            name: 'active',
            type: 'bool',
            notNull: true,
            default: true,
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('table comment', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                },
              ],
              comment: 'store our users.',
            },
          ],
        }),
      )

      const expected = aDBStructure({
        tables: {
          users: aTable({
            name: 'users',
            columns: {
              id: aColumn({
                name: 'id',
                type: 'int',
                notNull: true,
                primary: false,
                unique: false,
              }),
            },
            comment: 'store our users.',
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    it('column comment', async () => {
      const { value } = await processor(
        JSON.stringify({
          name: 'testdb',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  nullable: false,
                  comment: 'this is description',
                },
              ],
            },
          ],
        }),
      )

      const expected = userTable({
        columns: {
          id: aColumn({
            name: 'id',
            type: 'int',
            notNull: true,
            primary: false,
            unique: false,
            comment: 'this is description',
          }),
        },
      })

      expect(value).toEqual(expected)
    })

    describe('relationship', () => {
      const relationshipCases = [
        ['exactly_one', 'zero_or_one', 'ONE_TO_ONE'],
        ['exactly_one', 'zero_or_more', 'ONE_TO_MANY'],
        ['exactly_one', 'one_or_more', 'ONE_TO_MANY'],
      ]

      it.each(relationshipCases)(
        'relationship %s - %s',
        async (parentCardinality, cardinality, expectedCardinality) => {
          const { value } = await processor(
            JSON.stringify({
              name: 'testdb',
              tables: [
                {
                  name: 'users',
                  type: 'TABLE',
                  columns: [
                    {
                      name: 'id',
                      type: 'int',
                      nullable: false,
                    },
                  ],
                },
                {
                  name: 'posts',
                  type: 'TABLE',
                  columns: [
                    {
                      name: 'id',
                      type: 'int',
                      nullable: false,
                    },
                    {
                      name: 'user_id',
                      type: 'int',
                      nullable: false,
                    },
                  ],
                },
              ],
              relations: [
                {
                  table: 'posts',
                  columns: ['user_id'],
                  cardinality: cardinality,
                  parent_table: 'users',
                  parent_columns: ['id'],
                  parent_cardinality: parentCardinality,
                  def: 'FOREIGN KEY (user_id) REFERENCES users (id)',
                },
              ],
            }),
          )

          const expected = {
            users_id_to_posts_user_id: {
              name: 'users_id_to_posts_user_id',
              primaryTableName: 'users',
              primaryColumnName: 'id',
              foreignTableName: 'posts',
              foreignColumnName: 'user_id',
              cardinality: expectedCardinality,
              updateConstraint: 'NO_ACTION',
              deleteConstraint: 'NO_ACTION',
            },
          }

          expect(value.relationships).toEqual(expected)
        },
      )
    })
  })
})
