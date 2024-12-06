import { Check as PrimitiveCheck } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveCheck>

export const Check: FC<Props> = (props) => (
  <PrimitiveCheck strokeWidth={1.5} {...props} />
)
