import { IconButton, Scan } from '@liam-hq/ui'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import { useReactFlow } from '@xyflow/react'
import { type FC, useCallback } from 'react'

export const FitviewButton: FC = () => {
  const { fitView } = useReactFlow()

  const handleClick = useCallback(() => {
    fitView()
  }, [fitView])

  return (
    <ToolbarButton asChild onClick={handleClick}>
      <IconButton icon={<Scan />} tooltipContent="Zoom to Fit" />
    </ToolbarButton>
  )
}
