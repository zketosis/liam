import { MessagesSquare as PrimitiveMessagesSquare } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveMessagesSquare>

export const MessagesSquare: FC<Props> = (props) => (
  <PrimitiveMessagesSquare strokeWidth={1.5} {...props} />
)
