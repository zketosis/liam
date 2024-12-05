import { XIcon as PrimitiveXIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveXIcon>

export const XIcon: FC<Props> = (props) => (
  <PrimitiveXIcon strokeWidth={1.5} {...props} />
)
