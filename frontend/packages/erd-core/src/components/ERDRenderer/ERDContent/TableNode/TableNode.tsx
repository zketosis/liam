import type { Table } from '@liam/db-structure'
import type { Node, NodeProps } from '@xyflow/react'
import type { FC } from 'react'
import styles from './TableNode.module.css'

type Data = {
  table: Table
}

type TableNodeType = Node<Data, 'Table'>

type Props = NodeProps<TableNodeType>

export const TableNode: FC<Props> = ({ data: { table } }) => {
  return (
    <div className={styles.wrapper}>
      <div>{table.name}</div>
      <ul>
        {table.fields.map((field) => (
          <li key={field.name}>
            <span>{field.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
