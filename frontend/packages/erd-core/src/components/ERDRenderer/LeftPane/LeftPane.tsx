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
import { useNodes } from '@xyflow/react'
import { useMemo } from 'react'
import { isTableNode } from '../ERDContent'
import { TableCounter } from './TableCounter'
import { TableNameMenuButton } from './TableNameMenuButton'

export const LeftPane = () => {
  const nodes = useNodes()
  const tableNodes = useMemo(() => nodes.filter(isTableNode), [nodes])

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tables</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tableNodes.map((node) => (
                <TableNameMenuButton key={node.id} node={node} />
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
