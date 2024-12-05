import { Fingerprint as PrimitiveFingerprint } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveFingerprint>

export const Fingerprint: FC<Props> = (props) => (
  <PrimitiveFingerprint strokeWidth={1.5} {...props} />
)
