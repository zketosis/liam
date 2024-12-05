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
import { useDBStructureStore } from '../../../stores'
import styles from './LeftPane.module.css'
import { TableCounter } from './TableCounter'

export const LeftPane = () => {
  const { tables } = useDBStructureStore()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tables</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.values(tables).map((table) => (
                <SidebarMenuItem key={table.name}>
                  <SidebarMenuButton>
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
