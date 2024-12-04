import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@liam-hq/ui'
import { BookText, CircleHelp, MessagesSquare } from 'lucide-react'
import { forwardRef } from 'react'
import styles from './HelpButton.module.css'

export const HelpButton = forwardRef<HTMLButtonElement>((_, ref) => {
  return (
    <DropdownMenuRoot>
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button ref={ref} type="button" className={styles.iconWrapper}>
                <CircleHelp className={styles.icon} />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>Help</TooltipContent>
        </TooltipRoot>
      </TooltipProvider>

      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className={styles.menuContent}
        >
          <DropdownMenuItem size="sm" leftIcon={<BookText />}>
            Documentation
          </DropdownMenuItem>
          <DropdownMenuItem size="sm" leftIcon={<MessagesSquare />}>
            Community Forum
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  )
})

HelpButton.displayName = 'HelpButton'
