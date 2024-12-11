import {
  updateActiveTableName,
  useDBStructureStore,
  useUserEditingStore,
} from '@/stores'
import { DrawerContent, DrawerPortal, DrawerRoot } from '@liam-hq/ui'
import type { FC, PropsWithChildren } from 'react'
// biome-ignore lint/nursery/useImportRestrictions: Fixed in the next PR.
import { TableDetail } from '../ERDContent/TableNode/TableDetail'
import styles from './TableDetailDrawer.module.css'

const handleClose = () => updateActiveTableName(undefined)

export const TableDetailDrawerRoot: FC<PropsWithChildren> = ({ children }) => {
  const {
    active: { tableName },
  } = useUserEditingStore()

  return (
    <DrawerRoot
      direction="right"
      // Set snapPoints to an empty array to disable the drawer snapping functionality.
      // This behavior is an undocumented, unofficial usage and might change in the future.
      // ref: https://github.com/emilkowalski/vaul/blob/main/src/use-snap-points.ts
      snapPoints={[]}
      open={tableName !== undefined}
      onClose={handleClose}
    >
      {children}
    </DrawerRoot>
  )
}

export const TableDetailDrawer: FC = () => {
  const { tables } = useDBStructureStore()
  const {
    active: { tableName },
  } = useUserEditingStore()
  const table = tables[tableName ?? '']
  const ariaDescribedBy =
    table?.comment == null
      ? {
          'aria-describedby': undefined,
        }
      : {}

  return (
    <DrawerPortal>
      <DrawerContent className={styles.content} {...ariaDescribedBy}>
        {table !== undefined && <TableDetail table={table} />}
      </DrawerContent>
    </DrawerPortal>
  )
}
