'use client'

import { createClient } from '@/libs/db/client'
import { Button, Input, useToast } from '@liam-hq/ui'
import { useParams } from 'next/navigation'
import { type FC, useState } from 'react'
import styles from './GeneralPage.module.css'

// Fetch organization data directly
const fetchOrganizationName = async (
  organizationId: string,
): Promise<string> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', organizationId)
    .single()

  if (error) {
    console.error('Error fetching organization:', error)
    return ''
  }

  return data?.name || ''
}

export const GeneralPage: FC = () => {
  const params = useParams()
  // Ensure organizationId is a string
  const organizationId =
    typeof params.organizationId === 'string'
      ? params.organizationId
      : Array.isArray(params.organizationId)
        ? params.organizationId[0]
        : undefined

  // State for form data and UI state
  const [organizationData, setOrganizationData] = useState<{
    name: string
    isLoading: boolean
    isInitialLoading: boolean
    error: string | null
    success: boolean
  }>({
    name: '',
    isLoading: false,
    isInitialLoading: true,
    error: null,
    success: false,
  })
  const toast = useToast()

  // Initialize data loading
  if (organizationId && organizationData.isInitialLoading) {
    fetchOrganizationName(organizationId).then((name) => {
      setOrganizationData((prev) => ({
        ...prev,
        name,
        isInitialLoading: false,
      }))
    })
  }

  const handleSave = async () => {
    if (!organizationData.name.trim()) {
      setOrganizationData((prev) => ({
        ...prev,
        error: 'Organization name cannot be empty',
      }))
      return
    }

    if (!organizationId) {
      setOrganizationData((prev) => ({
        ...prev,
        error: 'Organization ID is missing',
      }))
      return
    }

    setOrganizationData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
    }))

    const supabase = createClient()
    const { error } = await supabase
      .from('organizations')
      .update({ name: organizationData.name.trim() })
      .eq('id', organizationId)

    if (error) {
      setOrganizationData((prev) => ({
        ...prev,
        error: 'Failed to update organization name',
        isLoading: false,
      }))
      console.error(error)
      return
    }

    setOrganizationData((prev) => ({
      ...prev,
      success: true,
      isLoading: false,
    }))
    toast({
      title: 'Updated',
      description: 'Organization name has been successfully updated',
      status: 'success',
    })
    setTimeout(() => {
      setOrganizationData((prev) => ({ ...prev, success: false }))
    }, 3000) // Clear success message after 3 seconds
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
                value={organizationData.name}
                onChange={(e) =>
                  setOrganizationData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className={styles.input}
                error={!!organizationData.error}
                disabled={organizationData.isInitialLoading}
              />
              {organizationData.error && (
                <p className={styles.errorText}>{organizationData.error}</p>
              )}
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
            disabled={
              organizationData.isLoading || organizationData.isInitialLoading
            }
          >
            {organizationData.isLoading ? 'Saving...' : 'Save'}
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
            disabled={organizationData.isInitialLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
