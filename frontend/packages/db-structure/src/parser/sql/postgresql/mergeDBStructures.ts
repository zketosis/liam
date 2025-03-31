import type { DBStructure } from '../../../schema/index.js'

export const mergeDBStructures = (target: DBStructure, source: DBStructure) => {
  for (const [tableName, table] of Object.entries(source.tables)) {
    target.tables[tableName] = {
      ...target.tables[tableName],
      ...table,
      columns: {
        ...target.tables[tableName]?.columns,
        ...table.columns,
      },
      indexes: {
        ...target.tables[tableName]?.indexes,
        ...table.indexes,
      },
    }
  }

  for (const [relationshipName, relationship] of Object.entries(
    source.relationships,
  )) {
    target.relationships[relationshipName] = relationship
  }
}
