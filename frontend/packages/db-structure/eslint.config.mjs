import { createBaseConfig } from '../../packages/configs/eslint/index.js'

export default [
  ...createBaseConfig({
    tsconfigPath: './tsconfig.json',
  }),
  {
    ignores: ['dist/**'],
  },
  {
    files: ['src/parser/schemarb/parser.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['src/parser/sql/postgresql/parser.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
]
