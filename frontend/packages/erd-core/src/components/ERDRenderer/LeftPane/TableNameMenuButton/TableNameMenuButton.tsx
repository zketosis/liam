import { updateActiveTableName, useUserEditingStore } from '@/stores'
import { SidebarMenuButton, SidebarMenuItem, Table2 } from '@liam-hq/ui'
import type { FC } from 'react'
import type { TableNodeType } from '../../ERDContent'
import styles from '../LeftPane.module.css'
import { VisibilityButton } from './VisibilityButton'

const handleClickMenuButton = (tableId: string) => () => {
  updateActiveTableName(tableId)
}

type Props = {
  node: TableNodeType
}

export const TableNameMenuButton: FC<Props> = ({ node }) => {
  const {
    active: { tableName },
  } = useUserEditingStore()
  const name = node.data.table.name

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleClickMenuButton(name)}
        className={name === tableName ? styles.active : ''}
      >
        <Table2 width="10px" />
        <span className={styles.tableName}>{name}</span>
        <VisibilityButton tableName={name} hidden={node.hidden} />
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
