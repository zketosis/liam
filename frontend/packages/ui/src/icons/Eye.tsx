import { Eye as PrimitiveEye } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveEye>

export const Eye: FC<Props> = (props) => (
  <PrimitiveEye strokeWidth={1.5} {...props} />
)
