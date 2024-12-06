import { IconButton, TidyUpIcon } from '@liam-hq/ui'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import type { FC } from 'react'

export const TidyUpButton: FC = () => {
  return (
    // TODO: Implement a button click logic
    <ToolbarButton asChild>
      <IconButton icon={<TidyUpIcon />} tooltipContent="Tidy up" />
    </ToolbarButton>
  )
}
