'use client'

import { Button, Input } from '@liam-hq/ui'
import { type FC, useState } from 'react'
import styles from './GeneralPage.module.css'

export const GeneralPage: FC = () => {
  const [organizationName, setOrganizationName] = useState('Elyro')

  const handleSave = () => {
    // TODO: Implement save functionality
    // Save organization name
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    // Delete organization
  }

  return (
    <div className={styles.container}>
      {/* Organization Name Section */}
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.rowContainer}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Organization Name</h3>
            </div>
            <div className={styles.inputContainer}>
              <Input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className={styles.input}
              />
              <p className={styles.helperText}>
                This is your team's visible name within Liam Migration. For
                example, the name of your company or team.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.cardFooter}>
          <Button
            variant="solid-primary"
            onClick={handleSave}
            className={styles.saveButton}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Delete Organization Section */}
      <div className={styles.dangerCard}>
        <div className={styles.cardContent}>
          <div className={styles.rowContainer}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Delete Organization</h3>
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.dangerText}>
                Permanently remove your organization and all of its contents
                from the Liam Migration.
                <br />
                This action is not reversible — please continue with caution.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.dangerDivider} />
        <div className={styles.cardFooter}>
          <Button
            variant="solid-danger"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
