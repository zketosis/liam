import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react'

import type { FC } from 'react'

type Data = {
  isHovered: boolean
}

export type RelationshipEdgeType = Edge<Data, 'relationship'>

type Props = EdgeProps<RelationshipEdgeType>

export const RelationshipEdge: FC<Props> = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  id,
  data,
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
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: data?.isHovered
            ? 'var(--node-layout)'
            : 'var(--global-border)',
          strokeDasharray: '2',
          transition: 'stroke 0.3s var(--default-timing-function)',
        }}
      />
    </>
  )
}
