import type { FC } from 'react'

interface IconProps {
  size?: number
}

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
