import { CircleHelp as PrimitiveCircleHelp } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveCircleHelp>

export const CircleHelp: FC<Props> = (props) => (
  <PrimitiveCircleHelp strokeWidth={1.5} {...props} />
)
