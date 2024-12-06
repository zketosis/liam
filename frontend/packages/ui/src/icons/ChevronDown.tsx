import { ChevronDown as PrimitiveChevronDown } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveChevronDown>

export const ChevronDown: FC<Props> = (props) => (
  <PrimitiveChevronDown strokeWidth={1.5} {...props} />
)
