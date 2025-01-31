import type { FC } from 'react'
import styles from './NetworkErrorDisplay.module.css'

type ErrorObject = {
  name: string
  message: string
}

type Props = {
  errors: ErrorObject[]
}

export const NetworkErrorDisplay: FC<Props> = ({ errors }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.message1}>
        <div className={styles.message1Title}>
          Oh no! We’ve encountered some NetworkErrors 🛸💫
        </div>

        {errors[0] && (
          <div className={styles.message1Sentence}>
            <ul>
              <li key={errors[0].name}>
                <code>
                  {errors[0].name}: {errors[0].message}
                </code>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
