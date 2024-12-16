import {
  Button,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@liam-hq/ui'
import { type FC, useCallback } from 'react'

export const CopyLinkButton: FC = () => {
  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href)
  }, [])

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Button variant="solid-primary" size="md" onClick={handleCopyUrl}>
            Copy Link
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent sideOffset={4}>Copy current URL</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
