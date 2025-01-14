import { InfoIcon } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './ErrorDisplay.module.css'
import { ParseErrorDisplay } from './ParseErrorDisplay'

type ErrorObject = {
  name: string
  message: string
}

type Props = {
  errors: ErrorObject[]
}

export const ErrorDisplay: FC<Props> = ({ errors }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.iconWrapper}>
          <InfoIcon color="var(--callout-warning-text)" />
        </div>
        <ParseErrorDisplay errors={errors}/>
      </div>
    </div>
  )
}
