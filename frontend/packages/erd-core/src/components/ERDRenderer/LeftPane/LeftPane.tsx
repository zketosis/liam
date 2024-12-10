import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@liam-hq/ui'
import { Table2 } from '@liam-hq/ui'
import {
  updateActiveTableId,
  useDBStructureStore,
  useUserEditingStore,
} from '../../../stores'
import styles from './LeftPane.module.css'
import { TableCounter } from './TableCounter'

const handleClickMenuButton = (tableId: string) => () => {
  updateActiveTableId(tableId)
}

export const LeftPane = () => {
  const { tables } = useDBStructureStore()
  const {
    active: { tableId },
  } = useUserEditingStore()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tables</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.values(tables).map((table) => (
                <SidebarMenuItem key={table.name}>
                  <SidebarMenuButton
                    onClick={handleClickMenuButton(table.name)}
                    className={table.name === tableId ? styles.active : ''}
                  >
                    <Table2 width="10px" />
                    <span className={styles.tableName}>{table.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <TableCounter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
