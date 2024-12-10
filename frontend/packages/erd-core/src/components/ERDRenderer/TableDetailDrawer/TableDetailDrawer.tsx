import {
  updateActiveTableId,
  useDBStructureStore,
  useUserEditingStore,
} from '@/stores'
import { DrawerContent, DrawerPortal, DrawerRoot } from '@liam-hq/ui'
import type { FC, PropsWithChildren } from 'react'
import { TableDetail } from '../ERDContent/TableNode/TableDetail'
import styles from './TableDetailDrawer.module.css'

const handleClose = () => updateActiveTableId(undefined)

export const TableDetailDrawerRoot: FC<PropsWithChildren> = ({ children }) => {
  const {
    active: { tableId },
  } = useUserEditingStore()

  return (
    <DrawerRoot
      direction="right"
      // Set snapPoints to an empty array to disable the drawer snapping functionality.
      // This behavior is an undocumented, unofficial usage and might change in the future.
      // ref: https://github.com/emilkowalski/vaul/blob/main/src/use-snap-points.ts
      snapPoints={[]}
      open={tableId !== undefined}
      onClose={handleClose}
    >
      {children}
    </DrawerRoot>
  )
}

export const TableDetailDrawer: FC = () => {
  const { tables } = useDBStructureStore()
  const {
    active: { tableId },
  } = useUserEditingStore()
  const table = tables[tableId ?? '']

  return (
    <DrawerPortal>
      <DrawerContent className={styles.content}>
        {table !== undefined && <TableDetail table={table} />}
      </DrawerContent>
    </DrawerPortal>
  )
}
