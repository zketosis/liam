import type { TableNodeType } from '@/features/erd/types'
import { useUserEditingStore } from '@/stores'
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@liam-hq/ui'
import type { NodeProps } from '@xyflow/react'
import clsx from 'clsx'
import type React from 'react'
import type { FC } from 'react'
import type { HoverInfo } from '../../ERDContent'
import { TableColumnList } from './TableColumnList'
import { TableHeader } from './TableHeader'
import styles from './TableNode.module.css'

type Props = NodeProps<TableNodeType>

export const TableNode: FC<Props> = ({ data }) => {
  const { showMode: _showMode } = useUserEditingStore()
  const showMode = data.showMode ?? _showMode
  const name = data?.table?.name

  const handleTableNodeHoverEvent = (
    event: React.MouseEvent,
    hoverInfo?: HoverInfo,
  ) => {
    data.onTableColumnMouseEnter?.(
      event,
      { id: hoverInfo?.tableName },
      hoverInfo,
    )
  }

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div
            className={clsx(
              styles.wrapper,
              data.isHighlighted && styles.wrapperHighlighted,
              data.isActiveHighlighted && styles.wrapperActive,
            )}
            data-erd={
              (data.isHighlighted || data.isActiveHighlighted) &&
              'table-node-highlighted'
            }
          >
            <TableHeader data={data} />
            {showMode === 'ALL_FIELDS' && (
              <TableColumnList
                data={data}
                onTableColumnMouseEnter={handleTableNodeHoverEvent}
              />
            )}
            {showMode === 'KEY_ONLY' && (
              <TableColumnList
                data={data}
                filter="KEY_ONLY"
                onTableColumnMouseEnter={handleTableNodeHoverEvent}
              />
            )}
          </div>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent side={'top'} sideOffset={4}>
            {name}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
