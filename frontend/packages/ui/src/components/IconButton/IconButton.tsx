import type { ComponentProps, FC, ReactNode } from 'react'
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '../Tooltip'
import styles from './IconButton.module.css'

type Props = {
  icon: ReactNode
  tooltipSide?: ComponentProps<typeof TooltipContent>['side']
  tooltipContent: string
}

export const IconButton: FC<Props> = ({
  icon,
  tooltipSide = 'bottom',
  tooltipContent,
}) => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>{icon}</span>
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side={tooltipSide} sideOffset={4}>
            {tooltipContent}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
