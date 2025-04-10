import { createClient } from '@/libs/db/client'
import { urlgen } from '@/utils/routes'
import { useRouter } from 'next/navigation'

export const useCreateOrganization = () => {
  const router = useRouter()

  const createOrganization = async (name: string) => {
    const supabase = await createClient()

    const { data: organization, error: orgError } = await supabase
      .from('Organization')
      .insert({ name })
      .select('id')
      .single()

    if (orgError) throw orgError
    return organization
  }

  const addUserToOrganization = async (
    userId: string,
    organizationId: number,
  ) => {
    const supabase = await createClient()

    const { error: memberError } = await supabase
      .from('OrganizationMember')
      .insert({
        userId,
        organizationId,
        status: 'ACTIVE',
      })

    if (memberError) throw memberError
  }

  const checkOrganizationProjects = async (organizationId: number) => {
    const supabase = await createClient()

    const { data: projects, error: projectsError } = await supabase
      .from('Project')
      .select('id')
      .eq('organizationId', organizationId)
      .limit(1)

    if (projectsError) throw projectsError
    return projects
  }

  const handleCreateOrganization = async (name: string) => {
    try {
      const supabase = await createClient()

      const organization = await createOrganization(name)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      await addUserToOrganization(userData.user.id, organization.id)

      const projects = await checkOrganizationProjects(organization.id)

      if (projects && projects.length > 0) {
        router.push(urlgen('projects'))
      } else {
        router.push(
          urlgen('organizations/[organizationId]/projects/new', {
            organizationId: organization.id.toString(),
          })
        )
      }

      return { success: true }
    } catch (err) {
      console.error('Error creating organization:', err)
      return {
        success: false,
        error: 'Failed to create organization. Please try again.',
      }
    }
  }

  return { handleCreateOrganization }
}
