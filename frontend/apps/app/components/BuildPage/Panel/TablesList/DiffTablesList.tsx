import type { Schema, TableGroup } from '@liam-hq/db-structure'
import type { FC } from 'react'
import { useMemo } from 'react'
import { diff } from '../services/diff'
import styles from './DiffTablesList.module.css'

type DiffTablesListProps = {
  before: Schema
  after: Schema
  tableGroups: Record<string, TableGroup>
}

type StatusInfo = {
  className: string
  prefix: string
}

// Schemaの列定義の型
type SchemaColumnDef = {
  name: string
  type: string
  default: string | number | boolean | null
  check: string | null
  primary: boolean
  unique: boolean
  notNull: boolean
  comment: string | null
  [key: string]: unknown
}

// 表示用のカラム情報
type ColumnInfo = SchemaColumnDef & {
  status: StatusInfo
}

// Schemaのインデックス定義の型
type SchemaIndexDef = {
  name: string
  unique: boolean
  columns: string[]
  type: string
  [key: string]: unknown
}

// Schemaの制約定義の型
type SchemaConstraintDef = {
  type: string
  name: string
  columnName?: string
  targetTableName?: string
  targetColumnName?: string
  updateConstraint?: string
  deleteConstraint?: string
  detail?: string
  [key: string]: unknown
}

// 表示用のインデックス情報
type IndexInfo = {
  name: string
  status: StatusInfo
  data: SchemaIndexDef
}

// 表示用の制約情報
type ConstraintInfo = {
  name: string
  status: StatusInfo
  data: SchemaConstraintDef
}

export const DiffTablesList: FC<DiffTablesListProps> = ({
  before,
  after,
  tableGroups,
}) => {
  // diff関数を使用して差分を取得
  const operations = useMemo(() => diff(before, after), [before, after])

  // テーブルを収集（beforeとafterの両方から）
  const allTableNames = useMemo(() => {
    const beforeTables = Object.keys(before.tables || {})
    const afterTables = Object.keys(after.tables || {})
    return [...new Set([...beforeTables, ...afterTables])]
  }, [before, after])

  // テーブルの状態を取得するヘルパー関数
  const getTableStatus = (tableName: string): StatusInfo => {
    const addOp = operations.find(
      (op) => op.op === 'add' && op.path === `/tables/${tableName}`,
    )
    const removeOp = operations.find(
      (op) => op.op === 'remove' && op.path === `/tables/${tableName}`,
    )

    if (addOp) return { className: styles.added, prefix: '+' }
    if (removeOp) return { className: styles.removed, prefix: '-' }

    // テーブル自体は変更されていないが、カラムなどが変更されている場合
    const hasChanges = operations.some((op) => {
      const pathParts = op.path.split('/')
      return (
        pathParts.length > 3 &&
        pathParts[1] === 'tables' &&
        pathParts[2] === tableName
      )
    })

    return hasChanges
      ? { className: styles.modified, prefix: ' ' }
      : { className: '', prefix: ' ' }
  }

  // 特定のテーブルのカラム情報を取得するヘルパー関数
  const getColumnsForTable = (
    tableName: string,
  ): { columns: ColumnInfo[]; isRemoved: boolean } => {
    const beforeTable = before.tables[tableName]
    const afterTable = after.tables[tableName]

    // テーブルが削除された場合
    if (!afterTable && beforeTable) {
      return {
        columns: Object.values(beforeTable.columns).map((column) => ({
          ...column,
          status: { className: styles.removed, prefix: '-' },
        })),
        isRemoved: true,
      }
    }

    // テーブルが追加された場合
    if (afterTable && !beforeTable) {
      return {
        columns: Object.values(afterTable.columns).map((column) => ({
          ...column,
          status: { className: styles.added, prefix: '+' },
        })),
        isRemoved: false,
      }
    }

    // テーブルが変更された場合
    if (afterTable && beforeTable) {
      const allColumnNames = [
        ...new Set([
          ...Object.keys(beforeTable.columns),
          ...Object.keys(afterTable.columns),
        ]),
      ]

      const columns = allColumnNames.map((columnName) => {
        const beforeColumn = beforeTable.columns[columnName]
        const afterColumn = afterTable.columns[columnName]

        // カラムが削除された場合
        if (!afterColumn && beforeColumn) {
          return {
            ...beforeColumn,
            status: { className: styles.removed, prefix: '-' },
          }
        }

        // カラムが追加された場合
        if (afterColumn && !beforeColumn) {
          return {
            ...afterColumn,
            status: { className: styles.added, prefix: '+' },
          }
        }

        // カラムが変更された場合
        const isModified = operations.some((op) => {
          const pathParts = op.path.split('/')
          return (
            pathParts.length > 5 &&
            pathParts[1] === 'tables' &&
            pathParts[2] === tableName &&
            pathParts[3] === 'columns' &&
            pathParts[4] === columnName
          )
        })

        return {
          ...afterColumn,
          status: isModified
            ? { className: styles.modified, prefix: ' ' }
            : { className: '', prefix: ' ' },
        }
      })

      return { columns, isRemoved: false }
    }

    return { columns: [], isRemoved: false }
  }

  // テーブルグループを取得するヘルパー関数
  const getTableGroupsForTable = (tableName: string): string[] => {
    return Object.entries(tableGroups)
      .filter(([_, group]) => group.tables.includes(tableName))
      .map(([_, group]) => group.name)
  }

  // 変更情報の詳細を取得するヘルパー関数
  const getColumnChanges = (
    tableName: string,
    columnName: string,
  ): { property: string; before: unknown; after: unknown }[] => {
    const changes: { property: string; before: unknown; after: unknown }[] = []
    const beforeTable = before.tables[tableName]
    const afterTable = after.tables[tableName]

    if (!beforeTable || !afterTable) return changes

    const beforeColumn = beforeTable.columns[columnName]
    const afterColumn = afterTable.columns[columnName]

    if (!beforeColumn || !afterColumn) return changes

    // カラムのプロパティを比較
    const propertyKeys = [
      'type',
      'default',
      'check',
      'primary',
      'unique',
      'notNull',
      'comment',
    ] as const

    for (const prop of propertyKeys) {
      const beforeValue = beforeColumn[prop as keyof typeof beforeColumn]
      const afterValue = afterColumn[prop as keyof typeof afterColumn]

      if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
        changes.push({
          property: prop,
          before: beforeValue,
          after: afterValue,
        })
      }
    }

    return changes
  }

  // インデックスの変更を取得するヘルパー関数
  const getIndexesForTable = (tableName: string): IndexInfo[] => {
    const beforeTable = before.tables[tableName]
    const afterTable = after.tables[tableName]

    // テーブルが存在しない場合
    if (!beforeTable && !afterTable) return []

    // インデックスを収集
    const beforeIndexes = beforeTable?.indexes || {}
    const afterIndexes = afterTable?.indexes || {}
    const allIndexNames = [
      ...new Set([...Object.keys(beforeIndexes), ...Object.keys(afterIndexes)]),
    ]

    return allIndexNames.map((indexName) => {
      const beforeIndex = beforeIndexes[indexName]
      const afterIndex = afterIndexes[indexName]

      // インデックスが削除された場合
      if (!afterIndex && beforeIndex) {
        return {
          name: indexName,
          status: { className: styles.removed, prefix: '-' },
          data: beforeIndex,
        }
      }

      // インデックスが追加された場合
      if (afterIndex && !beforeIndex) {
        return {
          name: indexName,
          status: { className: styles.added, prefix: '+' },
          data: afterIndex,
        }
      }

      // インデックスが変更された場合
      const isModified =
        JSON.stringify(beforeIndex) !== JSON.stringify(afterIndex)

      return {
        name: indexName,
        status: isModified
          ? { className: styles.modified, prefix: ' ' }
          : { className: '', prefix: ' ' },
        data: afterIndex,
      }
    })
  }

  // 制約の変更を取得するヘルパー関数
  const getConstraintsForTable = (tableName: string): ConstraintInfo[] => {
    const beforeTable = before.tables[tableName]
    const afterTable = after.tables[tableName]

    // テーブルが存在しない場合
    if (!beforeTable && !afterTable) return []

    // 制約を収集
    const beforeConstraints = beforeTable?.constraints || {}
    const afterConstraints = afterTable?.constraints || {}
    const allConstraintNames = [
      ...new Set([
        ...Object.keys(beforeConstraints),
        ...Object.keys(afterConstraints),
      ]),
    ]

    return allConstraintNames.map((constraintName) => {
      const beforeConstraint = beforeConstraints[constraintName]
      const afterConstraint = afterConstraints[constraintName]

      // 制約が削除された場合
      if (!afterConstraint && beforeConstraint) {
        return {
          name: constraintName,
          status: { className: styles.removed, prefix: '-' },
          data: beforeConstraint,
        }
      }

      // 制約が追加された場合
      if (afterConstraint && !beforeConstraint) {
        return {
          name: constraintName,
          status: { className: styles.added, prefix: '+' },
          data: afterConstraint,
        }
      }

      // 制約が変更された場合
      const isModified =
        JSON.stringify(beforeConstraint) !== JSON.stringify(afterConstraint)

      return {
        name: constraintName,
        status: isModified
          ? { className: styles.modified, prefix: ' ' }
          : { className: '', prefix: ' ' },
        data: afterConstraint,
      }
    })
  }

  return (
    <div className={styles.diffTablesList}>
      <div className={styles.tablesContainer}>
        {allTableNames.map((tableName) => {
          const tableStatus = getTableStatus(tableName)
          const { columns, isRemoved } = getColumnsForTable(tableName)
          const tableGroupNames = getTableGroupsForTable(tableName)
          const indexes = getIndexesForTable(tableName)
          const constraints = getConstraintsForTable(tableName)

          return (
            <div
              key={tableName}
              className={`${styles.tableItem} ${tableStatus.className}`}
            >
              <div className={styles.diffLine}>
                <span className={styles.diffPrefix}>{tableStatus.prefix}</span>
                <div className={styles.diffContent}>
                  <div className={styles.tableName}>{tableName}</div>
                </div>
              </div>

              <div className={styles.tableInfo}>
                {tableGroupNames.length > 0 && (
                  <div className={styles.tableGroups}>
                    {tableGroupNames.map((groupName) => (
                      <span key={groupName} className={styles.tableGroupTag}>
                        {groupName}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.tableDetails}>
                {/* カラム情報 */}
                <div className={styles.sectionTitle}>Columns</div>
                <div className={styles.tableColumns}>
                  {columns.map((column) => {
                    const changes = !isRemoved
                      ? getColumnChanges(tableName, column.name)
                      : []

                    return (
                      <div
                        key={column.name}
                        className={`${styles.columnItem} ${column.status.className}`}
                      >
                        <div className={styles.diffLine}>
                          <span className={styles.diffPrefix}>
                            {column.status.prefix}
                          </span>
                          <div className={styles.diffContent}>
                            <span className={styles.columnName}>
                              {column.name}
                            </span>
                            <span className={styles.columnType}>
                              {column.type}
                            </span>
                            {column.primary && (
                              <span className={styles.columnTag}>PK</span>
                            )}
                            {column.unique && (
                              <span className={styles.columnTag}>UQ</span>
                            )}
                            {column.notNull && (
                              <span className={styles.columnTag}>NOT NULL</span>
                            )}
                            {column.default && (
                              <span className={styles.columnDefault}>
                                DEFAULT: {column.default}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 変更の詳細を表示 */}
                        {changes.length > 0 && (
                          <div className={styles.columnChanges}>
                            {changes.map((change) => (
                              <div
                                key={`${change.property}-${String(change.before)}-${String(change.after)}`}
                                className={styles.columnChangeItem}
                              >
                                <div className={styles.changeProperty}>
                                  {change.property}:
                                </div>
                                <div className={styles.changeValues}>
                                  <div className={styles.changeOld}>
                                    - {JSON.stringify(change.before)}
                                  </div>
                                  <div className={styles.changeNew}>
                                    + {JSON.stringify(change.after)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* インデックス情報 */}
                {indexes.length > 0 && (
                  <>
                    <div className={styles.sectionTitle}>Indexes</div>
                    <div className={styles.tableIndexes}>
                      {indexes.map((index) => (
                        <div
                          key={index.name}
                          className={`${styles.indexItem} ${index.status.className}`}
                        >
                          <div className={styles.diffLine}>
                            <span className={styles.diffPrefix}>
                              {index.status.prefix}
                            </span>
                            <div className={styles.diffContent}>
                              <span className={styles.indexName}>
                                {index.name}
                              </span>
                              <span className={styles.indexDetails}>
                                {index.data.unique ? 'UNIQUE ' : ''}
                                {index.data.type || 'btree'}(
                                {(index.data.columns || []).join(', ')})
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 制約情報 */}
                {constraints.length > 0 && (
                  <>
                    <div className={styles.sectionTitle}>Constraints</div>
                    <div className={styles.tableConstraints}>
                      {constraints.map((constraint) => (
                        <div
                          key={constraint.name}
                          className={`${styles.constraintItem} ${constraint.status.className}`}
                        >
                          <div className={styles.diffLine}>
                            <span className={styles.diffPrefix}>
                              {constraint.status.prefix}
                            </span>
                            <div className={styles.diffContent}>
                              <span className={styles.constraintName}>
                                {constraint.name}
                              </span>
                              <span className={styles.constraintType}>
                                {constraint.data.type}
                              </span>
                              <span className={styles.constraintDetails}>
                                {constraint.data.columnName || ''}
                                {constraint.data.targetTableName
                                  ? ` → ${constraint.data.targetTableName}.${constraint.data.targetColumnName || ''}`
                                  : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
