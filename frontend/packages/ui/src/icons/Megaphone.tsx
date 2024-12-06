import { Megaphone as PrimitiveMegaphone } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveMegaphone>

export const Megaphone: FC<Props> = (props) => (
  <PrimitiveMegaphone strokeWidth={1.5} {...props} />
)
