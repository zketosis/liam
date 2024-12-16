import { updateActiveTableName, useUserEditingStore } from '@/stores'
import { SidebarMenuButton, SidebarMenuItem, Table2 } from '@liam-hq/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import type { TableNodeType } from '../../ERDContent'
import styles from './TableNameMenuButton.module.css'
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
        className={clsx(styles.button, name === tableName && styles.active)}
        asChild
      >
        <div
          // biome-ignore lint/a11y/useSemanticElements: Implemented with div button to be button in button
          role="button"
          tabIndex={0}
          onClick={handleClickMenuButton(name)}
          onKeyDown={handleClickMenuButton(name)}
        >
          <Table2 width="10px" />
          <span className={styles.tableName}>{name}</span>
          <VisibilityButton tableName={name} hidden={node.hidden} />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
