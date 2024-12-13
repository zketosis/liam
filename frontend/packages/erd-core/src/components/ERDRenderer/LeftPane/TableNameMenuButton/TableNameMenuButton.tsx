import { updateActiveTableName, useUserEditingStore } from '@/stores'
import type { Table } from '@liam-hq/db-structure'
import { SidebarMenuButton, SidebarMenuItem, Table2 } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from '../LeftPane.module.css'

const handleClickMenuButton = (tableId: string) => () => {
  updateActiveTableName(tableId)
}

type Props = {
  table: Table
}

export const TableNameMenuButton: FC<Props> = ({ table }) => {
  const {
    active: { tableName },
  } = useUserEditingStore()

  return (
    <SidebarMenuItem key={table.name}>
      <SidebarMenuButton
        onClick={handleClickMenuButton(table.name)}
        className={table.name === tableName ? styles.active : ''}
      >
        <Table2 width="10px" />
        <span className={styles.tableName}>{table.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
