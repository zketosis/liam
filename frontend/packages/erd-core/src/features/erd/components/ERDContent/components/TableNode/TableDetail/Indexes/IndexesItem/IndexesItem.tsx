import {
  TableDd,
  TableDt,
  TableHeader,
  TableItem,
  TableRoot,
} from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './IndexesItem.module.css'

type Props = {
  index: {
    name: string
    unique: boolean
    columns: string[]
    type: string
  }
}

export const IndexesItem: FC<Props> = ({ index }) => {
  const HIDE_INDEX_TYPE = 'btree'

  return (
    <div className={styles.wrapper}>
      <TableRoot>
        <TableHeader>{index.name}</TableHeader>
        {index.type && index.type.toLowerCase() !== HIDE_INDEX_TYPE && (
          <TableItem>
            <TableDt>Type</TableDt>
            <TableDd>{index.type}</TableDd>
          </TableItem>
        )}
        {!!index.columns.length && (
          <TableItem>
            <TableDt>
              {index.columns.length === 1 ? 'Column' : 'Columns'}
            </TableDt>
            <TableDd>
              {index.columns.length === 1 ? (
                index.columns[0]
              ) : (
                <ol className={styles.list}>
                  {index.columns.map((column) => (
                    <li key={column}>{column}</li>
                  ))}
                </ol>
              )}
            </TableDd>
          </TableItem>
        )}
        <TableItem>
          <TableDt>Unique</TableDt>
          <TableDd>{index.unique ? 'Yes' : 'No'}</TableDd>
        </TableItem>
      </TableRoot>
    </div>
  )
}
