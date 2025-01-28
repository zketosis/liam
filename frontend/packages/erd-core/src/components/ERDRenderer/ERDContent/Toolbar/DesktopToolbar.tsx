import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './DesktopToolbar.module.css'
import { FitviewButton } from './FitviewButton'
import { ShowModeMenu } from './ShowModeMenu'
import { TidyUpButton } from './TidyUpButton'
import { ZoomControls } from './ZoomControls'

type Props = {
  className?: string
}

export const DesktopToolbar: FC<Props> = ({ className }) => {
  return (
    <ToolbarPrimitive.Root className={clsx(styles.root, className)}>
      <ZoomControls />
      <ToolbarPrimitive.Separator className={styles.separator} />
      <div className={styles.buttons}>
        <FitviewButton />
        <TidyUpButton />
        {/* TODO: enable once implemented */}
        {/* <ViewControlButton /> */}
      </div>
      <ToolbarPrimitive.Separator className={styles.separator} />
      <ShowModeMenu />
    </ToolbarPrimitive.Root>
  )
}
