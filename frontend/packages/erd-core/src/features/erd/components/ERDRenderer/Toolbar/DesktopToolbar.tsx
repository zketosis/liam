import type { TableGroup } from '@liam-hq/db-structure'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import type { FC } from 'react'
import styles from './DesktopToolbar.module.css'
import { FitviewButton } from './FitviewButton'
import { GroupButton } from './GroupButton'
import { ShowModeMenu } from './ShowModeMenu'
import { TidyUpButton } from './TidyUpButton'
import { ZoomControls } from './ZoomControls'

type DesktopToolbarProps = {
  onAddTableGroup: ((props: TableGroup) => void) | undefined
}

export const DesktopToolbar: FC<DesktopToolbarProps> = ({
  onAddTableGroup,
}) => {
  return (
    <ToolbarPrimitive.Root className={styles.root} aria-label="Toolbar">
      <ZoomControls />
      <ToolbarPrimitive.Separator className={styles.separator} />
      <div className={styles.buttons}>
        <FitviewButton />
        <TidyUpButton />
        {onAddTableGroup && <GroupButton onAddTableGroup={onAddTableGroup} />}
        {/* TODO: enable once implemented */}
        {/* <ViewControlButton /> */}
      </div>
      <ToolbarPrimitive.Separator className={styles.separator} />
      <ShowModeMenu />
    </ToolbarPrimitive.Root>
  )
}
