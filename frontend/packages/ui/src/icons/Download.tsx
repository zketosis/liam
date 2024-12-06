import { Download as PrimitiveDownload } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveDownload>

export const Download: FC<Props> = (props) => (
  <PrimitiveDownload strokeWidth={1.5} {...props} />
)
