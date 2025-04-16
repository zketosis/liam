import { MessageSquareText as PrimitiveMessageSquareText } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveMessageSquareText>

export const MessageSquareText: FC<Props> = (props) => (
  <PrimitiveMessageSquareText strokeWidth={1.5} {...props} />
)
