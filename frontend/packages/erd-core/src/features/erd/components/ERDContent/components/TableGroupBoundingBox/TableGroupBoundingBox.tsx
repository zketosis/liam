import type { FC } from 'react'
import styles from './TableGroupBoundingBox.module.css'

type Props = {
  left: number
  top: number
  width: number
  height: number
}

export const TableGroupBoundingBox: FC<Props> = ({
  left,
  top,
  width,
  height,
}) => {
  return (
    <div style={{ left, top, width, height }} className={styles.box}>
      <div className={`${styles.vertex} ${styles.topLeft}`} />
      <div className={`${styles.vertex} ${styles.topRight}`} />
      <div className={`${styles.vertex} ${styles.bottomLeft}`} />
      <div className={`${styles.vertex} ${styles.bottomRight}`} />
    </div>
  )
}
