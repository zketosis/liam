import { BookText as PrimitiveBookText } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveBookText>

export const BookText: FC<Props> = (props) => (
  <PrimitiveBookText strokeWidth={1.5} {...props} />
)
