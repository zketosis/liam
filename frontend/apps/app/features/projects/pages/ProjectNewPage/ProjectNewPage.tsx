import type { Installation } from '@/libs/github/types'
import type { FC } from 'react'
import { InstallationSelector } from './InstallationSelector/InstallationSelector'
import styles from './ProjectNewPage.module.css'

type Props = {
  installations: Installation[]
}

export const ProjectNewPage: FC<Props> = ({ installations }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add a Project</h1>
      <InstallationSelector installations={installations} />
    </div>
  )
}
