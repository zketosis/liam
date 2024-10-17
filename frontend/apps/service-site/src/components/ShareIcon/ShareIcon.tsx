import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@packages/ui'
import clsx from 'clsx'
import { Share } from '../Icons'
import styles from './ShareIcon.module.css'

export const ShareIcon = () => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <span className={clsx(styles.wrapper)}>
            <Share className={clsx(styles.icon)} />
          </span>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent sideOffset={8} side="top">
            Share
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
