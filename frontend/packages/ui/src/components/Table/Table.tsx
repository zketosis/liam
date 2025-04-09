import type React from 'react'
import type { ComponentProps } from 'react'
import styles from './Table.module.css'

type TableRootProps = ComponentProps<'dl'>
export const TableRoot: React.FC<TableRootProps> = (props) => (
  <dl className={styles.root} {...props} />
)

type TableHeaderProps = ComponentProps<'dt'>
export const TableHeader: React.FC<TableHeaderProps> = (props) => (
  <div className={styles.dlItem}>
    <dt className={styles.dtHeader} {...props} />
  </div>
)

type TableItemProps = ComponentProps<'div'>
export const TableItem: React.FC<TableItemProps> = (props) => (
  <div className={styles.dlItem} {...props} />
)

type TableDtProps = ComponentProps<'dt'>
export const TableDt: React.FC<TableDtProps> = (props) => (
  <dt className={styles.dt} {...props} />
)

type TableDdProps = ComponentProps<'dd'>
export const TableDd: React.FC<TableDdProps> = (props) => (
  <dd className={styles.dd} {...props} />
)
