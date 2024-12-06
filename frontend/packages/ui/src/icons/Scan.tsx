import { Scan as PrimitiveScan } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveScan>

export const Scan: FC<Props> = (props) => (
  <PrimitiveScan strokeWidth={1.5} {...props} />
)
