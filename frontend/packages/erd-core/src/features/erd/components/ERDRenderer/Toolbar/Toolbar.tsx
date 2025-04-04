import type { TableGroup } from '@liam-hq/db-structure'
import type { FC } from 'react'
import { DesktopToolbar } from './DesktopToolbar'
import { MobileToolbar } from './MobileToolbar'

type ToolbarProps = {
  onAddTableGroup: ((params: TableGroup) => void) | undefined
}

export const Toolbar: FC<ToolbarProps> = ({ onAddTableGroup }) => {
  return (
    <>
      <MobileToolbar onAddTableGroup={onAddTableGroup} />
      <DesktopToolbar onAddTableGroup={onAddTableGroup} />
    </>
  )
}
