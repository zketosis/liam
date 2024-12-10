import { useDBStructureStore } from '@/stores'
import { DrawerContent, DrawerPortal, DrawerRoot } from '@liam-hq/ui'
import type { FC, PropsWithChildren } from 'react'
import { TableDetail } from '../ERDContent/TableNode/TableDetail'
import styles from './TableDetailDrawer.module.css'

export const TableDetailDrawerRoot: FC<PropsWithChildren> = ({ children }) => {
  return (
    // Set snapPoints to an empty array to disable the drawer snapping functionality.
    // This behavior is an undocumented, unofficial usage and might change in the future.
    // ref: https://github.com/emilkowalski/vaul/blob/main/src/use-snap-points.ts
    <DrawerRoot direction="right" snapPoints={[]}>
      {children}
    </DrawerRoot>
  )
}

export const TableDetailDrawer: FC = () => {
  const { tables } = useDBStructureStore()
  const table = Object.values(tables)[0]

  return (
    <DrawerPortal>
      <DrawerContent className={styles.content}>
        {table !== undefined && <TableDetail table={table} />}
      </DrawerContent>
    </DrawerPortal>
  )
}
