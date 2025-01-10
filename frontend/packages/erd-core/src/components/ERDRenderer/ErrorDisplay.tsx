import type { ProcessError } from '@liam-hq/db-structure'
import type { FC } from 'react'
import styles from './ErrorDisplay.module.css'

type Props = {
  errors: ProcessError[]
}

export const ErrorDisplay: FC<Props> = ({ errors }) => {
  // TODO: styling
  return (
    <div className={styles.wrapper}>
      <div>something went wrong</div>
      <ul>
        {errors.map((error) => (
          // NOTE: error.stack is not available in the browser now.
          <li key={error.message}>
            {error.name}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
