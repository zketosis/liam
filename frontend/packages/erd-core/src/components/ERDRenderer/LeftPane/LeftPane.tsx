import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from '@liam-hq/ui'
import { useDBStructureStore } from '../../../stores'
import { TableCounter } from './TableCounter'
import { TableNameMenuButton } from './TableNameMenuButton'

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
                <TableNameMenuButton key={table.name} table={table} />
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
