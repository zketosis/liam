import { Rows3 as Rows3Icon } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof Rows3Icon>

export const Rows3: FC<Props> = (props) => (
  <Rows3Icon strokeWidth={1.5} {...props} />
)
