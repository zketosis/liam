import { ChevronsUpDown as PrimitiveChevronsUpDown } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveChevronsUpDown>

export const ChevronsUpDown: FC<Props> = (props) => (
  <PrimitiveChevronsUpDown strokeWidth={1.5} {...props} />
)
