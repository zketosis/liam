import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react'

import type { FC } from 'react'

type Props = EdgeProps<Edge>

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
