import { Plus as PrimitivePlus } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitivePlus>

export const Plus: FC<Props> = (props) => (
  <PrimitivePlus strokeWidth={1.5} {...props} />
)
