import { InfoIcon } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './ErrorDisplay.module.css'
import { NetworkErrorDisplay } from './NetworkErrorDisplay'
import { ParseErrorDisplay } from './ParseErrorDisplay'

type ErrorObject = {
  name: string
  message: string
}

type Props = {
  errors: ErrorObject[]
}

export const ErrorDisplay: FC<Props> = ({ errors }) => {
  const error = errors[0]
  if (!error) return <></>
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.iconWrapper}>
          <InfoIcon color="var(--callout-warning-text)" />
        </div>
        {error.name === 'NetworkError' && (
          <NetworkErrorDisplay errors={errors} />
        )}
        {error.name !== 'NetworkError' && <ParseErrorDisplay errors={errors} />}
      </div>
    </div>
  )
}
