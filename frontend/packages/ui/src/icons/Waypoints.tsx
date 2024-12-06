import { Waypoints as PrimitiveWaypoints } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveWaypoints>

export const Waypoints: FC<Props> = (props) => (
  <PrimitiveWaypoints strokeWidth={1.5} {...props} />
)
