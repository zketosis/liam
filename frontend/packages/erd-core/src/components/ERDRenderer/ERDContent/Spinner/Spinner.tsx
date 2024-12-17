import clsx from 'clsx'
import type { FC } from 'react'
import styles from './Spinner.module.css'

type Props = {
  className?: string
}

export const Spinner: FC<Props> = ({ className }) => {
  return (
    <span className={clsx(styles.spinnerBox, className)}>
      <span className={styles.circleBorder}>
        <span className={styles.circleCore} />
      </span>
    </span>
  )
}
