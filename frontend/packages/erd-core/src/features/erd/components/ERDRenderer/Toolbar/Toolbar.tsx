import type { FC } from 'react'
import { DesktopToolbar } from './DesktopToolbar'
import { MobileToolbar } from './MobileToolbar'

type ToolbarProps = {
  withGroupButton?: boolean
}

export const Toolbar: FC<ToolbarProps> = ({ withGroupButton = false }) => {
  return (
    <>
      <MobileToolbar withGroupButton={withGroupButton} />
      <DesktopToolbar withGroupButton={withGroupButton} />
    </>
  )
}
