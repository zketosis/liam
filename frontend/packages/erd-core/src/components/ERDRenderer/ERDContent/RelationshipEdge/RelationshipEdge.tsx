import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react'

import type { FC } from 'react'
import styles from './RelationshipEdge.module.css'

export type RelationshipEdgeType = Edge

type Props = EdgeProps<RelationshipEdgeType>

export const RelationshipEdge: FC<Props> = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  label,
  id,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div className={styles.labelWrapper}>
          <span>{label}</span>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
