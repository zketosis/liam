import { describe, expect, it } from 'vitest'
import type { Table } from '../../../schema/index.js'
import { aColumn, aDBStructure, aTable } from '../../../schema/index.js'
import { parserTestCases } from '../../__tests__/index.js'
import { processor } from './index.js'

describe(processor, () => {
  describe('should parse create_table correctly', () => {
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
              name: aColumn({
                name: 'name',
                type: 'varchar',
                notNull: false,
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

    it('table comment', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY
        );
        COMMENT ON TABLE users IS 'store our users.';
      `)

      expect(result).toEqual(parserTestCases['table comment'])
    })

    it('column commnet', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          description TEXT
        );
        COMMENT ON COLUMN users.description IS 'this is description';
      `)

      expect(result).toEqual(parserTestCases['column comment'])
    })

    it('not null', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `)

      expect(result).toEqual(parserTestCases['not null'])
    })

    it('nullable', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          description TEXT
        );
      `)

      expect(result).toEqual(parserTestCases.nullable)
    })

    it('default value as string', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          description TEXT DEFAULT 'user''s description'
        );
      `)

      expect(result).toEqual(parserTestCases['default value as string'])
    })

    it('default value as integer', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          age INTEGER DEFAULT 30
        );
      `)

      expect(result).toEqual(parserTestCases['default value as integer'])
    })

    it('default value as boolean', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          active BOOLEAN DEFAULT TRUE
        );
      `)

      expect(result).toEqual(parserTestCases['default value as boolean'])
    })

    it('unique', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          mention TEXT UNIQUE
        );
      `)

      expect(result).toEqual(parserTestCases.unique)
    })

    it('index (unique: false)', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255)
        );

        CREATE INDEX index_users_on_id_and_email ON public.users USING btree (id, email);
      `)

      expect(result).toEqual(parserTestCases['index (unique: false)'])
    })

    it('index (unique: true)', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255)
        );

        CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);
      `)

      expect(result).toEqual(parserTestCases['index (unique: true)'])
    })

    it('foreign keys by create table', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE posts (
          id BIGSERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id)
        );
      `)

      const expectedRelationships = {
        users_id_to_posts_user_id: {
          name: 'users_id_to_posts_user_id',
          primaryTableName: 'users',
          primaryColumnName: 'id',
          foreignTableName: 'posts',
          foreignColumnName: 'user_id',
          cardinality: 'ONE_TO_MANY',
          updateConstraint: 'NO_ACTION',
          deleteConstraint: 'NO_ACTION',
        },
      }

      expect(result.relationships).toEqual(expectedRelationships)
    })

    it('unique foreign keys by create table', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE posts (
          id BIGSERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) UNIQUE
        );
      `)

      const expectedRelationships = {
        users_id_to_posts_user_id: {
          name: 'users_id_to_posts_user_id',
          primaryTableName: 'users',
          primaryColumnName: 'id',
          foreignTableName: 'posts',
          foreignColumnName: 'user_id',
          cardinality: 'ONE_TO_ONE',
          updateConstraint: 'NO_ACTION',
          deleteConstraint: 'NO_ACTION',
        },
      }

      expect(result.relationships).toEqual(expectedRelationships)
    })

    it('foreign keys with no action by alter table', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL
        );

        ALTER TABLE posts
        ADD CONSTRAINT fk_posts_user_id FOREIGN KEY (user_id) REFERENCES users(id);
      `)

      const expectedRelationships = {
        fk_posts_user_id: {
          name: 'fk_posts_user_id',
          primaryTableName: 'users',
          primaryColumnName: 'id',
          foreignTableName: 'posts',
          foreignColumnName: 'user_id',
          cardinality: 'ONE_TO_MANY',
          updateConstraint: 'NO_ACTION',
          deleteConstraint: 'NO_ACTION',
        },
      }

      expect(result.relationships).toEqual(expectedRelationships)
    })

    it('foreign keys with action by alter table', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL
        );

        ALTER TABLE posts
        ADD CONSTRAINT fk_posts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;
      `)

      const expectedRelationships = {
        fk_posts_user_id: {
          name: 'fk_posts_user_id',
          primaryTableName: 'users',
          primaryColumnName: 'id',
          foreignTableName: 'posts',
          foreignColumnName: 'user_id',
          cardinality: 'ONE_TO_MANY',
          updateConstraint: 'CASCADE',
          deleteConstraint: 'SET_NULL',
        },
      }

      expect(result.relationships).toEqual(expectedRelationships)
    })

    it('unique foreign keys by alter table', async () => {
      const result = await processor(/* sql */ `
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL UNIQUE
        );

        ALTER TABLE posts
        ADD CONSTRAINT fk_posts_user_id FOREIGN KEY (user_id) REFERENCES users(id);
      `)

      const expectedRelationships = {
        fk_posts_user_id: {
          name: 'fk_posts_user_id',
          primaryTableName: 'users',
          primaryColumnName: 'id',
          foreignTableName: 'posts',
          foreignColumnName: 'user_id',
          cardinality: 'ONE_TO_ONE',
          updateConstraint: 'NO_ACTION',
          deleteConstraint: 'NO_ACTION',
        },
      }

      expect(result.relationships).toEqual(expectedRelationships)
    })
  })
})
