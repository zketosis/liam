import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react'

import type { FC } from 'react'

export type RelationshipEdgeType = Edge

type Props = EdgeProps<RelationshipEdgeType>

export const RelationshipEdge: FC<Props> = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
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
    </>
  )
}
