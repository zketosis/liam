import { createClient } from '@/libs/db/server'
import { describe, expect, it, vi } from 'vitest'
import { getProjects } from './getProjects'

describe('getProjects', () => {
  it.skip('should return projects with the correct structure', async () => {
    const supabase = await createClient()
    await supabase.from('Project').insert({
      name: 'Test Project',
      updatedAt: new Date().toISOString(),
    })

    const projects = await getProjects()

    // Check the structure of the first project
    const project = projects?.[0]
    expect(project).toHaveProperty('id')
    expect(project).toHaveProperty('name')
    expect(project).toHaveProperty('createdAt')
  })
})
