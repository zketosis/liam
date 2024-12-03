import { describe, expect, it } from 'vitest'
import type { Table } from '../../../schema/index.js'
import { aColumn, aDBStructure, aTable } from '../../../schema/index.js'
import { processor } from './index.js'

describe(processor, () => {
  describe('should parse create_table correctry', () => {
    const userTable = (override?: Partial<Table>) =>
      aDBStructure({
        tables: {
          users: aTable({
            name: 'users',
            columns: {
              id: aColumn({
                name: 'id',
                type: 'serial',
                notNull: true,
                primary: true,
                increment: true,
              }),
              ...override?.columns,
            },
          }),
        },
      })

    it('not null', async () => {
      const result = await processor(/* PostgreSQL */ `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `)

      const expected = userTable({
        columns: {
          name: aColumn({
            name: 'name',
            type: 'varchar',
            notNull: true,
          }),
        },
      })

      expect(result).toEqual(expected)
    })

    it('nullable', async () => {
      const result = await processor(/* PostgreSQL */ `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255)
        );
      `)

      const expected = userTable({
        columns: {
          name: aColumn({
            name: 'name',
            type: 'varchar',
            notNull: false,
          }),
        },
      })

      expect(result).toEqual(expected)
    })

    // TODO: Implement default value
  })
})
