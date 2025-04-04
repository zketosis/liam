import type { TableGroup } from '@liam-hq/db-structure'
import { IconButton, Scan } from '@liam-hq/ui'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import { useNodes } from '@xyflow/react'
import { type ComponentProps, type FC, useCallback, useMemo } from 'react'

interface GroupButtonProps {
  size?: ComponentProps<typeof IconButton>['size']
  onAddTableGroup: (props: TableGroup) => void
}

export const GroupButton: FC<GroupButtonProps> = ({
  size = 'md',
  onAddTableGroup,
}) => {
  const nodes = useNodes()

  const selectedNodes = useMemo(
    () => nodes.filter((node) => node.selected),
    [nodes],
  )

  const hasSelectedNodes = useMemo(
    () => selectedNodes.length > 0,
    [selectedNodes],
  )

  const handleClick = useCallback(() => {
    if (!hasSelectedNodes) return

    // TODO: Allow users to define the group name
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:\.]/g, '')
      .substring(0, 14)
    const name = `Group_${timestamp}`

    onAddTableGroup({
      name,
      tables: selectedNodes.map((node) => node.id),
      comment: null,
    })
  }, [hasSelectedNodes, selectedNodes, onAddTableGroup])

  return (
    <ToolbarButton asChild onClick={handleClick}>
      <IconButton
        icon={<Scan />}
        size={size}
        tooltipContent="Group selected tables"
        disabled={!hasSelectedNodes}
        aria-label="Group tables"
      />
    </ToolbarButton>
  )
}
