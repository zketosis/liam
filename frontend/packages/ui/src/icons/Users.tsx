import { Users as PrimitiveUsers } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveUsers>

export const Users: FC<Props> = (props) => (
  <PrimitiveUsers strokeWidth={1.5} {...props} />
)
