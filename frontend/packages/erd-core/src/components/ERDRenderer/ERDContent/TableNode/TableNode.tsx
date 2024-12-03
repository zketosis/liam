import type { Table } from '@liam-hq/db-structure'
import {
  DrawerClose,
  DrawerContent,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
  KeyRound,
} from '@liam-hq/ui'
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
    <>
      <DrawerRoot direction="right">
        <DrawerTrigger>
          <div className={styles.wrapper}>
            <div>{table.name}</div>
            <ul>
              {Object.values(table.columns).map((column) => (
                <li key={column.name}>
                  <span>
                    {column.primary && (
                      <KeyRound
                        width={16}
                        height={16}
                        role="img"
                        aria-label="Primary Key"
                      />
                    )}
                  </span>
                  <span> </span>
                  <span>{column.name}</span>
                  <span> </span>
                  <span>{column.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerContent className={styles.content}>
            <DrawerClose>Close</DrawerClose>
            <div>TODO: Render TableDetail Component</div>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </>
  )
}
