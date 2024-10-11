import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@packages/ui'
import clsx from 'clsx'
import { Share } from '../Icons'
import styles from './ShareIconButton.module.css'

export const ShareIconButton = () => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button type="button" className={clsx(styles.button)}>
            <Share className={clsx(styles.icon)} />
          </button>
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
