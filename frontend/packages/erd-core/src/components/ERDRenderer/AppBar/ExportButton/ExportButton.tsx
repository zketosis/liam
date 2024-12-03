import {
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@liam-hq/ui'
import { ChevronDown, Download } from 'lucide-react'
import { type FC, useRef } from 'react'
import styles from './ExportButton.module.css'

export const ExportButton: FC = () => {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="outline-secondary"
            size="md"
            leftIcon={
              <Download
                strokeWidth={1.5}
                stroke="var(--button-secondary-foreground)"
              />
            }
            rightIcon={
              <ChevronDown strokeWidth={1.5} stroke="var(--overlay-40)" />
            }
          >
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            sideOffset={4}
            className={styles.menuContent}
          >
            <DropdownMenuItem>DDL</DropdownMenuItem>
            <DropdownMenuItem>schema.rb</DropdownMenuItem>
            <DropdownMenuItem>mermaid.js</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </>
  )
}
