import type { FC } from 'react'
import { PostgresIcon } from './icons/PostgresIcon'
import { PrismaIcon } from './icons/PrismaIcon'
import { SchemaRbIcon } from './icons/SchemaRbIcon'
import { TblsIcon } from './icons/TblsIcon'

export type FormatType = 'postgres' | 'prisma' | 'schemarb' | 'tbls'

interface FormatIconProps {
  format: FormatType
  size?: number
}

export const FormatIcon: FC<FormatIconProps> = ({ format, size = 16 }) => {
  switch (format) {
    case 'postgres':
      return <PostgresIcon size={size} />
    case 'prisma':
      return <PrismaIcon size={size} />
    case 'schemarb':
      return <SchemaRbIcon size={size} />
    case 'tbls':
      return <TblsIcon size={size} />
    default:
      return <PostgresIcon size={size} />
  }
}
