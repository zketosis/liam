import { JackInBoxIcon } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './EmptyProjectsState.module.css'

interface EmptyProjectsStateProps {
  createProjectHref?: string
}

export const EmptyProjectsState: FC<EmptyProjectsStateProps> = ({
  createProjectHref = '/organizations/new',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* JackInBox illustration */}
        <div className={styles.illustration}>
          <div className={styles.jackInBox}>
            <JackInBoxIcon className={styles.jackInBoxSvg} />

            {/* Cross SVG 1 */}
            <svg
              className={styles.cross1}
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              aria-hidden="true"
            >
              <title>Decorative cross icon 1</title>
              <path
                d="M0.629883 5.08984H2.30988"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.12012 5.08984H9.80012"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.21973 0.5V2.18"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.21973 7.99023V9.67023"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Plus SVG 1 */}
            <svg
              className={styles.plus1}
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="8"
              viewBox="0 0 7 8"
              fill="none"
              aria-hidden="true"
            >
              <title>Decorative plus icon 1</title>
              <path
                d="M3.74023 1.29004V6.76005"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.47 4.02002H1"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Plus SVG 2 */}
            <svg
              className={styles.plus2}
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="7"
              viewBox="0 0 7 7"
              fill="none"
              aria-hidden="true"
            >
              <title>Decorative plus icon 2</title>
              <path
                d="M3.72998 0.5V5.97"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.47 3.24023H1"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Cross SVG 2 */}
            <svg
              className={styles.cross2}
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              aria-hidden="true"
            >
              <title>Decorative cross icon 2</title>
              <path
                d="M0.769531 5.09961H2.44954"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.24951 5.09961H9.93951"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.34961 0.509766V2.19977"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.34961 8.00977V9.69977"
                stroke="#1DED83"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className={styles.textContent}>
          <h2 className={styles.title}>No Projects Yet</h2>
          <p className={styles.description}>
            Create your first project to start tracking your database schema
            changes.
          </p>
        </div>
      </div>

      {/* Create New Project button */}
      <Link href={createProjectHref} className={styles.createButton}>
        Create New Project
      </Link>
    </div>
  )
}
