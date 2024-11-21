import type { DBStructure, Table } from 'src/schema'
export const schemaRbConverter = {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
  convertToDBStructure(data: any): DBStructure {
    return {
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
      tables: data.tables.reduce((acc: Record<string, Table>, table: any) => {
        acc[table.name] = {
          comment: null,
          // biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
          fields: table.fields.map((field: any) => ({
            check: null,
            comment: null,
            default: 'default' in field ? field.default : null,
            increment: false,
            name: field.name,
            notNull: 'nullable' in field ? !field.nullable : false,
            primary: false,
            type: field.type.type_name,
            unique: false,
          })),
          indices: [],
          name: table.name,
          x: 0,
          y: 0,
          color: null,
        }
        return acc
      }, {}),
      relationships: {},
    }
  },
}
