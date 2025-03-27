export const override = {
  overrides: {
    addTables: {
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
        indices: {},
      },
    },
  },
} as const
