import {
  Megaphone,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './ReleaseNoteButton.module.css'

export const ReleaseNoteButton: FC = () => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button type="button" className={styles.iconWrapper}>
            <Megaphone className={styles.icon} />
          </button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent sideOffset={4}>Release Notes</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
