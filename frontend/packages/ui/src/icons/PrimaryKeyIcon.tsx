import { KeyRound } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<'svg'>

export const PrimaryKeyIcon: FC<Props> = (props) => {
  return <KeyRound role="img" aria-label="Primary Key" {...props} />
}
