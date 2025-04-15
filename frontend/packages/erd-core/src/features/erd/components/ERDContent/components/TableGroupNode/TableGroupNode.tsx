import type { TableGroupNodeType } from '@/features/erd/types'
import { IconButton, MessageSquareText } from '@liam-hq/ui'
import { type NodeProps, NodeResizer } from '@xyflow/react'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './TableGroupNode.module.css'

type Props = NodeProps<TableGroupNodeType>

export const TableGroupNode: FC<Props> = ({ data, selected = false }) => {
  return (
    <div className={clsx(styles.wrapper, selected && styles.wrapperSelected)}>
      <NodeResizer isVisible={selected} />
      <h1 className={clsx(styles.heading, selected && styles.headingSelected)}>
        {data.name}
      </h1>
      <div className={styles.commentButton}>
        <IconButton
          size="md"
          icon={<MessageSquareText />}
          tooltipContent="Comment"
          tooltipSide="top"
        />
      </div>
    </div>
  )
}
