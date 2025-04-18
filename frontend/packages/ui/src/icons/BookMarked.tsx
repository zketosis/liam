import { BookMarked as PrimitiveBookMarked } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveBookMarked>

export const BookMarked: FC<Props> = (props) => (
  <PrimitiveBookMarked strokeWidth={1.5} {...props} />
)
