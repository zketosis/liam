import { describe, expect, it } from 'vitest'
import type { DBStructure } from './dbStructure.js'
import { type DBOverride, applyOverrides } from './overrideDbStructure.js'

describe('overrideDbStructure', () => {
  // Basic original DB structure for testing
  const originalStructure: DBStructure = {
    tables: {
      users: {
        name: 'users',
        comment: 'User accounts',
        columns: {
          id: {
            name: 'id',
            type: 'uuid',
            default: null,
            check: null,
            primary: true,
            unique: true,
            notNull: true,
            comment: 'Primary key',
          },
          username: {
            name: 'username',
            type: 'varchar',
            default: null,
            check: null,
            primary: false,
            unique: true,
            notNull: true,
            comment: 'Unique username',
          },
        },
        indexes: {
          users_username_idx: {
            name: 'users_username_idx',
            unique: true,
            columns: ['username'],
            type: '',
          },
        },
        constraints: {
          PRIMARY: {
            type: 'PRIMARY KEY',
            name: 'PRIMARY',
            columnNames: ['id'],
          },
        },
      },
    },
    relationships: {
      // Empty initially
    },
    tableGroups: {},
  }

  describe('Overriding existing tables', () => {
    it('should override a table comment', () => {
      const override: DBOverride = {
        overrides: {
          tables: {
            users: {
              comment: 'Updated user accounts table',
            },
          },
        },
      }

      const { dbStructure } = applyOverrides(originalStructure, override)

      expect(dbStructure.tables['users']?.comment).toBe(
        'Updated user accounts table',
      )
      // Original columns should be preserved
      expect(dbStructure.tables['users']?.columns['id']).toBeDefined()
      expect(dbStructure.tables['users']?.columns['username']).toBeDefined()
    })

    it('should throw an error when overriding a non-existent table', () => {
      const override: DBOverride = {
        overrides: {
          tables: {
            nonexistent: {
              comment: 'This table does not exist',
            },
          },
        },
      }

      expect(() => applyOverrides(originalStructure, override)).toThrowError(
        'Cannot override non-existent table: nonexistent',
      )
    })
  })

  describe('Overriding column comments', () => {
    it('should override column comments in an existing table', () => {
      const override: DBOverride = {
        overrides: {
          tables: {
            users: {
              columns: {
                id: {
                  comment: 'Updated primary key comment',
                },
                username: {
                  comment: 'Updated username comment',
                },
              },
            },
          },
        },
      }

      const { dbStructure } = applyOverrides(originalStructure, override)

      expect(dbStructure.tables['users']?.columns['id']?.comment).toBe(
        'Updated primary key comment',
      )
      expect(dbStructure.tables['users']?.columns['username']?.comment).toBe(
        'Updated username comment',
      )
    })

    it('should throw an error when overriding a non-existent column', () => {
      const override: DBOverride = {
        overrides: {
          tables: {
            users: {
              columns: {
                nonexistent: {
                  comment: 'This column does not exist',
                },
              },
            },
          },
        },
      }

      expect(() => applyOverrides(originalStructure, override)).toThrowError(
        'Cannot override non-existent column nonexistent in table users',
      )
    })
  })

<<<<<<< HEAD
  describe('Adding constraints to existing tables', () => {
    it('should add new columns to an existing table', () => {
      const override: DBOverride = {
        overrides: {
          tables: {
            users: {
              addConstraints: {
                username_UNIQUE: {
                  type: 'UNIQUE',
                  name: 'username_UNIQUE',
                  columnNames: ['username'],
                },
              },
            },
          },
        },
      }

      const { dbStructure } = applyOverrides(originalStructure, override)

      // Check new constraints were added
      expect(
        dbStructure.tables['users']?.constraints['username_UNIQUE'],
      ).toBeDefined()
      expect(
        dbStructure.tables['users']?.constraints['username_UNIQUE'],
      ).toStrictEqual({
        type: 'UNIQUE',
        name: 'username_UNIQUE',
        columnNames: ['username'],
      })

      // Original constraints should still be there
      expect(dbStructure.tables['users']?.constraints['PRIMARY']).toBeDefined()
    })

    it('should throw an error when adding a constraint that already exists', () => {
      const override: DBOverride = {
        overrides: {
          tables: {
            users: {
              comment: 'User account',
              addConstraints: {
                PRIMARY: {
                  type: 'PRIMARY KEY',
                  name: 'PRIMARY',
                  columnNames: ['id'],
                },
              },
            },
          },
        },
      }

      expect(() => applyOverrides(originalStructure, override)).toThrowError(
        'Constraint PRIMARY already exists in the database structure',
      )
    })
  })

  describe('Adding relationships', () => {
    // For this test, we need a more complex DB structure with multiple tables
    const structureWithPosts: DBStructure = {
      tables: {
        ...originalStructure.tables,
        posts: {
          name: 'posts',
          comment: 'Blog posts',
          columns: {
            id: {
              name: 'id',
              type: 'uuid',
              default: null,
              check: null,
              primary: true,
              unique: true,
              notNull: true,
              comment: 'Primary key',
            },
            user_id: {
              name: 'user_id',
              type: 'uuid',
              default: null,
              check: null,
              primary: false,
              unique: false,
              notNull: true,
              comment: 'Foreign key to users',
            },
            title: {
              name: 'title',
              type: 'varchar',
              default: null,
              check: null,
              primary: false,
              unique: false,
              notNull: true,
              comment: 'Post title',
            },
          },
          indexes: {},
          constraints: {},
        },
      },
      relationships: {},
      tableGroups: {},
    }

    it('should add a new relationship', () => {
=======
  describe('Table groups', () => {
    it('should handle table groups', () => {
>>>>>>> main
      const override: DBOverride = {
        overrides: {
          tableGroups: {
            auth: {
              name: 'Authentication',
              tables: ['users'],
              comment: 'Tables related to authentication',
            },
          },
        },
      }

      const { tableGroups } = applyOverrides(originalStructure, override)

      expect(tableGroups['auth']).toBeDefined()
      expect(tableGroups['auth']?.name).toBe('Authentication')
      expect(tableGroups['auth']?.tables).toContain('users')
      expect(tableGroups['auth']?.comment).toBe(
        'Tables related to authentication',
      )
    })
  })

  describe('Complex scenarios', () => {
    it('should handle multiple override operations at once', () => {
      const structureWithPostsForTest: DBStructure = {
        tables: {
          ...originalStructure.tables,
          posts: {
            name: 'posts',
            comment: 'Blog posts',
            columns: {
              id: {
                name: 'id',
                type: 'uuid',
                default: null,
                check: null,
                primary: true,
                unique: true,
                notNull: true,
                comment: 'Primary key',
              },
              user_id: {
                name: 'user_id',
                type: 'uuid',
                default: null,
                check: null,
                primary: false,
                unique: false,
                notNull: true,
                comment: 'Foreign key to users',
              },
              title: {
                name: 'title',
                type: 'varchar',
                default: null,
                check: null,
                primary: false,
                unique: false,
                notNull: true,
                comment: 'Post title',
              },
            },
            indexes: {},
            constraints: {},
          },
        },
        relationships: {},
        tableGroups: {},
      }

      const override: DBOverride = {
        overrides: {
          tables: {
            users: {
              comment: 'User accounts with enhanced permissions',
              columns: {
                username: {
                  comment: 'User login name',
                },
              },
            },
            posts: {
              comment: 'User blog posts',
              columns: {
                title: {
                  comment: 'Post headline',
                },
              },
              // Add constraints to existing table
              addConstraints: {
                username_UNIQUE: {
                  type: 'UNIQUE',
                  name: 'username_UNIQUE',
                  columnNames: ['username'],
                },
              },
            },
          },
          tableGroups: {
            content: {
              name: 'Content',
              tables: ['posts'],
              comment: 'Content-related tables',
            },
            users: {
              name: 'Users',
              tables: ['users'],
              comment: 'User-related tables',
            },
          },
        },
      }

      const { dbStructure, tableGroups } = applyOverrides(
        structureWithPostsForTest,
        override,
      )

      expect(dbStructure.tables['users']?.comment).toBe(
        'User accounts with enhanced permissions',
      )
      expect(dbStructure.tables['posts']?.comment).toBe('User blog posts')

<<<<<<< HEAD
      // Check new column was added
      expect(dbStructure.tables['users']?.columns['email']).toBeDefined()

      // Check new constraint was added
      expect(
        dbStructure.tables['users']?.constraints['username_UNIQUE'],
      ).toBeDefined()

      // Check relationship was added
      expect(dbStructure.relationships['posts_users_fk']).toBeDefined()
      expect(dbStructure.relationships['posts_users_fk']?.cardinality).toBe(
        'ONE_TO_MANY',
=======
      expect(dbStructure.tables['users']?.columns['username']?.comment).toBe(
        'User login name',
>>>>>>> main
      )
      expect(dbStructure.tables['posts']?.columns['title']?.comment).toBe(
        'Post headline',
      )

      expect(tableGroups['content']).toBeDefined()
      expect(tableGroups['users']).toBeDefined()
      expect(tableGroups['content']?.tables).toContain('posts')
      expect(tableGroups['users']?.tables).toContain('users')
    })
  })
})
