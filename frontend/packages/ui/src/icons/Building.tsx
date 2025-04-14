import { Building as PrimitiveBuilding } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveBuilding>

export const Building: FC<Props> = (props) => (
  <PrimitiveBuilding strokeWidth={1.5} {...props} />
)
