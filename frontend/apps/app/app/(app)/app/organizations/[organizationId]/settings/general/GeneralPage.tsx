import {
  deleteOrganization,
  updateOrganizationName,
} from '@/features/organizations/actions/organizationActions'
import { getOrganizationDetails } from '@/features/organizations/pages/OrganizationDetailPage/getOrganizationDetails'
import { Button, Input, ToastNotifications } from '@liam-hq/ui'
import { redirect } from 'next/navigation'
import * as v from 'valibot'
import { DeleteOrganizationButton } from './DeleteOrganizationButton'
import styles from './GeneralPage.module.css'

// Define schemas for form validation
const organizationIdSchema = v.string('Organization ID must be a string')
const nameSchema = v.string('Organization name must be a string')

// Server action wrapper for form submission with redirect
async function handleUpdateOrganization(formData: FormData) {
  'use server'

  const organizationIdResult = v.safeParse(
    organizationIdSchema,
    formData.get('organizationId'),
  )
  const nameResult = v.safeParse(nameSchema, formData.get('name'))

  // Handle validation errors
  if (!organizationIdResult.success) {
    redirect(
      `/app/organizations/${formData.get('organizationId')}/settings/general?error=${encodeURIComponent('Invalid organization ID')}`,
    )
  }

  if (!nameResult.success) {
    redirect(
      `/app/organizations/${formData.get('organizationId')}/settings/general?error=${encodeURIComponent('Invalid organization name')}`,
    )
  }

  const organizationId = organizationIdResult.output
  const name = nameResult.output

  const result = await updateOrganizationName(organizationId, name)

  if (!result.success) {
    redirect(
      `/app/organizations/${organizationId}/settings/general?error=${encodeURIComponent(result.error || 'Failed to update organization name')}`,
    )
  }

  redirect(`/app/organizations/${organizationId}/settings/general?success=true`)
}

// Server action wrapper for deleting organization
async function handleDeleteOrganization(formData: FormData) {
  'use server'

  const organizationIdResult = v.safeParse(
    organizationIdSchema,
    formData.get('organizationId'),
  )

  // Handle validation error
  if (!organizationIdResult.success) {
    redirect(
      `/app/organizations/${formData.get('organizationId')}/settings/general?error=${encodeURIComponent('Invalid organization ID')}`,
    )
  }

  const organizationId = organizationIdResult.output

  // Get the organization details to verify the name
  const organization = await getOrganizationDetails(organizationId)
  if (!organization) {
    redirect(
      `/app/organizations/${organizationId}/settings/general?error=${encodeURIComponent('Organization not found')}`,
    )
  }

  // Verify that the confirmation text matches the organization name
  const confirmText = formData.get('confirmText')
  if (confirmText !== organization.name) {
    redirect(
      `/app/organizations/${organizationId}/settings/general?error=${encodeURIComponent('Confirmation text does not match organization name')}`,
    )
  }

  const result = await deleteOrganization(organizationId)

  if (!result.success) {
    redirect(
      `/app/organizations/${organizationId}/settings/general?error=${encodeURIComponent(result.error || 'Failed to delete organization')}`,
    )
  }

  // Redirect with success message and additional parameters for toast notification
  redirect(
    `/app/organizations?success=Organization "${organization.name}" has been deleted successfully`,
  )
}

export async function GeneralPage({
  organizationId,
  searchParams,
}: {
  organizationId: string
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Fetch organization details using the existing function
  const organization = await getOrganizationDetails(organizationId)

  if (!organization) {
    // Handle case where organization is not found
    return (
      <div className={styles.container}>
        <p>Organization not found</p>
      </div>
    )
  }

  // Extract status messages from URL
  const error =
    typeof searchParams?.error === 'string' ? searchParams.error : undefined
  const success =
    typeof searchParams?.success === 'string' ? searchParams.success : undefined

  return (
    <div className={styles.container}>
      <ToastNotifications
        error={error}
        success={success}
        successTitle="Updated"
        successDescription="Organization name has been successfully updated"
      />
      {/* Organization Name Section */}
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.rowContainer}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Organization Name</h3>
            </div>
            <div className={styles.inputContainer}>
              <Input
                name="name"
                form="updateOrgForm"
                defaultValue={organization.name}
                className={styles.input}
                error={!!error}
              />
              {error && <p className={styles.errorText}>{error}</p>}
              <p className={styles.helperText}>
                This is your team's visible name within Liam Migration. For
                example, the name of your company or team.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.cardFooter}>
          <form id="updateOrgForm" action={handleUpdateOrganization}>
            <input type="hidden" name="organizationId" value={organizationId} />
            <Button variant="solid-primary" type="submit">
              Save
            </Button>
          </form>
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
          {/* Client-side delete button that opens the modal */}
          <DeleteOrganizationButton
            organizationId={organizationId}
            organizationName={organization.name}
            handleDeleteOrganization={handleDeleteOrganization}
          />
        </div>
      </div>
    </div>
  )
}
