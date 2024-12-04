import { Table2 as Table2Icon } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof Table2Icon>

export const Table2: FC<Props> = (props) => (
  <Table2Icon strokeWidth={1.5} {...props} />
)
