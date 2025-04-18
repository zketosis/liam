import type { FC } from 'react'
import type { IconProps } from './types'

export const SchemaRbIcon: FC<IconProps> = ({ size = 16 }) => {
  return (
    <img
      src="/assets/schema-rb-icon.png"
      alt="SchemaRbIcon"
      width={size}
      height={size}
    />
  )
}
