import { Minus as PrimitiveMinus } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveMinus>

export const Minus: FC<Props> = (props) => (
  <PrimitiveMinus strokeWidth={1.5} {...props} />
)
