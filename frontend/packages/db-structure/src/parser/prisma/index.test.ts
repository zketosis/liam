import { describe, expect, it } from 'vitest'
import type { Table } from '../../schema/index.js'
import { aColumn, aDBStructure, aTable } from '../../schema/index.js'
import { processor } from './index.js'

describe(processor, () => {
  const userTable = (override?: Partial<Table>) =>
    aDBStructure({
      tables: {
        User: aTable({
          name: 'User',
          columns: {
            id: aColumn({
              name: 'id',
              type: 'Int',
              notNull: true,
              primary: true,
              unique: false,
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

  describe('Prisma Schema Parser', () => {
    it('not null', async () => {
      const schema = `
        model User {
          id   Int    @id @default(autoincrement())
          name String
        }
      `

      const expected = userTable({
        columns: {
          name: aColumn({
            name: 'name',
            type: 'String',
            notNull: true,
          }),
        },
      })

      const { value } = await processor(schema)

      expect(value).toEqual(expected)
    })
  })
})
