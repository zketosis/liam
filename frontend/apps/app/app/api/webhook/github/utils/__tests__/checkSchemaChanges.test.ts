import { getPullRequestFiles } from '@/libs/github/api.server'
import { savePullRequestTask } from '@/src/trigger/jobs'
import { prisma } from '@liam-hq/db'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkSchemaChanges } from '../checkSchemaChanges'

vi.mock('@/libs/github/api.server', () => ({
  getPullRequestFiles: vi.fn(() =>
    Promise.resolve([
      {
        filename: 'dummy.sql',
        status: 'added',
        additions: 1,
        deletions: 0,
        changes: 1,
        fileType: 'text',
      },
    ]),
  ),
}))

vi.mock('@/src/trigger/jobs', () => ({
  savePullRequestTask: { trigger: vi.fn() },
}))

vi.mock('@liam-hq/db', () => ({
  prisma: {
    watchSchemaFilePattern: {
      findMany: vi.fn().mockImplementation(() => Promise.resolve([])),
    },
  },
}))

describe('checkSchemaChanges', () => {
  const mockSchemaParams = {
    pullRequestNumber: 1,
    pullRequestTitle: 'Update schema',
    projectId: 100,
    owner: 'user',
    name: 'repo',
    installationId: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return false if project has no watchSchemaFilePatterns', async () => {
    vi.mocked(prisma.watchSchemaFilePattern.findMany).mockResolvedValue([])

    const result = await checkSchemaChanges(mockSchemaParams)
    expect(result).toEqual({ shouldContinue: false })
  })

  it('should return false if no files match the watch patterns', async () => {
    vi.mocked(prisma.watchSchemaFilePattern.findMany).mockResolvedValue([
      {
        id: 1,
        pattern: '**/*.sql',
        projectId: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    vi.mocked(getPullRequestFiles).mockResolvedValue([
      {
        filename: 'src/index.js',
        status: 'modified',
        additions: 10,
        deletions: 2,
        changes: 12,
        fileType: 'text',
      },
      {
        filename: 'README.md',
        status: 'modified',
        additions: 5,
        deletions: 1,
        changes: 6,
        fileType: 'text',
      },
    ])

    const result = await checkSchemaChanges(mockSchemaParams)
    expect(result).toEqual({ shouldContinue: false })
  })

  it('should return true and trigger the task if schema file changes are detected', async () => {
    vi.mocked(prisma.watchSchemaFilePattern.findMany).mockResolvedValue([
      {
        id: 1,
        pattern: '**/*.sql',
        projectId: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    vi.mocked(getPullRequestFiles).mockResolvedValue([
      {
        filename: 'migrations/2024_update.sql',
        status: 'added',
        additions: 20,
        deletions: 0,
        changes: 20,
        fileType: 'text',
      },
      {
        filename: 'src/index.js',
        status: 'modified',
        additions: 10,
        deletions: 2,
        changes: 12,
        fileType: 'text',
      },
    ])

    const result = await checkSchemaChanges(mockSchemaParams)
    expect(result).toEqual({ shouldContinue: true })
  })
})
