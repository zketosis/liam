import { describe, expect, it } from 'vitest'
import { parserTestCases } from '../../__tests__/index.js'
import { processor } from './index.js'

describe(processor, () => {
  describe('should parse create_table correctly', () => {
    it('table comment', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY
        );
        COMMENT ON TABLE users IS 'store our users.';
      `)

      expect(value).toEqual(parserTestCases['table comment'])
    })

    it('column commnet', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          description TEXT
        );
        COMMENT ON COLUMN users.description IS 'this is description';
      `)

      expect(value).toEqual(parserTestCases['column comment'])
    })

    it('not null', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `)

      expect(value).toEqual(parserTestCases['not null'])
    })

    it('nullable', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          description TEXT
        );
      `)

      expect(value).toEqual(parserTestCases.nullable)
    })

    it('default value as string', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          description TEXT DEFAULT 'user''s description'
        );
      `)

      expect(value).toEqual(parserTestCases['default value as string'])
    })

    it('default value as integer', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          age INTEGER DEFAULT 30
        );
      `)

      expect(value).toEqual(parserTestCases['default value as integer'])
    })

    it('default value as boolean', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          active BOOLEAN DEFAULT TRUE
        );
      `)

      expect(value).toEqual(parserTestCases['default value as boolean'])
    })

    it('unique', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          mention TEXT UNIQUE
        );
      `)

      expect(value).toEqual(parserTestCases.unique)
    })

    it('index (unique: false)', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255)
        );

        CREATE INDEX index_users_on_id_and_email ON public.users USING btree (id, email);
      `)

      expect(value).toEqual(parserTestCases['index (unique: false)'])
    })

    it('index (unique: true)', async () => {
      const { value } = await processor(/* sql */ `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255)
        );

        CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);
      `)

      expect(value).toEqual(parserTestCases['index (unique: true)'])
    })

    it('foreign keys by create table', async () => {
      const { value } = await processor(/* sql */ `
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

      expect(value.relationships).toEqual(expectedRelationships)
    })

    it('unique foreign keys by create table', async () => {
      const { value } = await processor(/* sql */ `
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

      expect(value.relationships).toEqual(expectedRelationships)
    })

    it('foreign keys with no action by alter table', async () => {
      const { value } = await processor(/* sql */ `
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

      expect(value.relationships).toEqual(expectedRelationships)
    })

    it('foreign keys with action by alter table', async () => {
      const { value } = await processor(/* sql */ `
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

      expect(value.relationships).toEqual(expectedRelationships)
    })

    it('unique foreign keys by alter table', async () => {
      const { value } = await processor(/* sql */ `
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

      expect(value.relationships).toEqual(expectedRelationships)
    })
  })
})
