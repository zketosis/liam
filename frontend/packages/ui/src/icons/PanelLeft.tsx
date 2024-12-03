import { PanelLeft as PanelLeftIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PanelLeftIcon>

export const PanelLeft: FC<Props> = (props) => (
  <PanelLeftIcon strokeWidth={1.5} {...props} />
)
