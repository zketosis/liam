import { createClient } from '@/libs/db/server'
import { describe, expect, it } from 'vitest'
import { getGitHubDocFilePaths } from './getGitHubDocFilePaths'

describe('getGitHubDocFilePaths', () => {
  it('should return doc file paths with correct structure', async () => {
    const supabase = await createClient()

    // Create test project
    const { data: project } = await supabase
      .from('Project')
      .insert({
        name: 'Test Project',
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    // Fail the test if project doesn't exist
    expect(project).not.toBeNull()

    if (!project) {
      throw new Error('Project is null')
    }

    // Create test doc file path
    const { data: docFilePath } = await supabase
      .from('GitHubDocFilePath')
      .insert({
        path: 'test/path.md',
        projectId: project.id,
        isReviewEnabled: true,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    expect(docFilePath).not.toBeNull()

    const paths = await getGitHubDocFilePaths(project.id.toString())

    expect(paths).not.toBeNull()
    expect(paths.length).toBeGreaterThan(0)
    expect(paths[0]).toHaveProperty('path', 'test/path.md')
    expect(paths[0]).toHaveProperty('isReviewEnabled', true)
    expect(paths[0]).toHaveProperty('projectId', project.id)
  })

  it('should return empty array when no paths exist', async () => {
    const paths = await getGitHubDocFilePaths('999999')
    expect(paths).toEqual([])
  })
})
