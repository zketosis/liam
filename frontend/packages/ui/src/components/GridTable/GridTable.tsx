import { clsx } from 'clsx'
import type React from 'react'
import type { ComponentProps } from 'react'
import styles from './GridTable.module.css'

type GridTableRootProps = ComponentProps<'dl'>
export const GridTableRoot: React.FC<GridTableRootProps> = (props) => (
  <dl className={styles.root} {...props} />
)

type GridTableHeaderProps = ComponentProps<'dt'>
export const GridTableHeader: React.FC<GridTableHeaderProps> = (props) => (
  <div className={styles.dlItem}>
    <dt className={styles.dtHeader} {...props} />
  </div>
)

type GridTableItemProps = ComponentProps<'div'>
export const GridTableItem: React.FC<GridTableItemProps> = (props) => (
  <div className={styles.dlItem} {...props} />
)

type GridTableDtProps = ComponentProps<'dt'>
export const GridTableDt: React.FC<GridTableDtProps> = (props) => (
  <dt className={styles.dt} {...props} />
)

type GridTableDdProps = ComponentProps<'dd'>
export const GridTableDd: React.FC<GridTableDdProps> = (props) => (
  <dd className={styles.dd} {...props} />
)

type GridTableRowProps = ComponentProps<'dt'>
export const GridTableRow: React.FC<GridTableRowProps> = (props) => (
  <dt className={clsx(styles.dt, styles.row)} {...props} />
)
