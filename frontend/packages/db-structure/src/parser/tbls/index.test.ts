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
              primary: false, // TODO: should be true
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
