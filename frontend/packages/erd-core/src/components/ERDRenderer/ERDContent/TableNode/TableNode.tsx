import type { Table } from '@liam-hq/db-structure'
import {
  DiamondFillIcon,
  DiamondIcon,
  DrawerClose,
  DrawerContent,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
  KeyRound,
} from '@liam-hq/ui'
import type { Node, NodeProps } from '@xyflow/react'
import type { FC } from 'react'
import { TableColumn } from './TableColumn'
import { TableHeader } from './TableHeader'
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
            <TableHeader name={table.name} />
            <ul>
              {Object.values(table.columns).map((column) => (
                <TableColumn key={column.name} column={column} />
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
