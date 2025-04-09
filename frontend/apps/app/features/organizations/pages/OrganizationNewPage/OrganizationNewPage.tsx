'use client'

import { Button } from '@liam-hq/ui'
import { createClient } from '@/libs/db/client'
import { urlgen } from '@/utils/routes'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'
import styles from './OrganizationNewPage.module.css'

export const OrganizationNewPage: FC = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      setError('Organization name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()
      
      const { data: organization, error: orgError } = await supabase
        .from('Organization')
        .insert({ name })
        .select('id')
        .single()

      if (orgError) throw orgError

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error: memberError } = await supabase
        .from('OrganizationMember')
        .insert({
          userId: userData.user.id,
          organizationId: organization.id,
          status: 'ACTIVE'
        })

      if (memberError) throw memberError

      const { data: projects, error: projectsError } = await supabase
        .from('Project')
        .select('id')
        .eq('organizationId', organization.id)
        .limit(1)

      if (projectsError) throw projectsError

      if (projects && projects.length > 0) {
        router.push(urlgen('projects'))
      } else {
        router.push(urlgen('projects/new'))
      }
    } catch (err) {
      console.error('Error creating organization:', err)
      setError('Failed to create organization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Organization</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Organization Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
            className={styles.input}
            disabled={loading}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </div>
  )
}
