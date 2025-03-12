import type React from 'react'
import { Form } from './Form'
import styles from './ProjectNewPage.module.css'

export const ProjectNewPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Form />
    </div>
  )
}
