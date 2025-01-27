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
  })
})
