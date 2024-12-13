import { EyeClosed as PrimitiveEyeClosed } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveEyeClosed>

export const EyeClosed: FC<Props> = (props) => (
  <PrimitiveEyeClosed strokeWidth={1.5} {...props} />
)
