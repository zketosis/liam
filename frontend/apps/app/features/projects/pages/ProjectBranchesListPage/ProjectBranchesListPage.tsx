import { prisma } from '@liam-hq/db'
import { getRepositoryBranches } from '@liam-hq/github'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { urlgen } from '../../../../utils/routes/urlgen'
import styles from './ProjectBranchesListPage.module.css'

type Props = {
  projectId: string
}

type RepositoryMapping = {
  repository: {
    id: number
    name: string
    owner: string
    installationId: bigint
  }
}

type RepoBranches = {
  repositoryId: number
  repositoryName: string
  repositoryOwner: string
  branches: Array<{
    name: string
  }>
}

async function getProjectAndBranches(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: Number(projectId),
    },
    select: {
      id: true,
      name: true,
      repositoryMappings: {
        select: {
          repository: {
            select: {
              id: true,
              name: true,
              owner: true,
              installationId: true,
            },
          },
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const branchesByRepo = await Promise.all(
    project.repositoryMappings.map(async (mapping: RepositoryMapping) => {
      const { repository } = mapping
      const branches = await getRepositoryBranches(
        Number(repository.installationId),
        repository.owner,
        repository.name,
      )

      return {
        repositoryId: repository.id,
        repositoryName: repository.name,
        repositoryOwner: repository.owner,
        branches: branches.map((branch) => ({
          name: branch.name,
        })),
      }
    }),
  )

  return {
    ...project,
    branchesByRepo,
  }
}

export const ProjectBranchesListPage: FC<Props> = async ({ projectId }) => {
  const project = await getProjectAndBranches(projectId)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link
            href={`/app/projects/${project.id}`}
            className={styles.backLink}
            aria-label="Back to project details"
          >
            ← Back to Project
          </Link>
          <h1 className={styles.title}>
            {project.name || 'Untitled Project'} - Branches
          </h1>
        </div>
      </div>

      <div className={styles.content}>
        {project.branchesByRepo.map((repo: RepoBranches) => (
          <section key={repo.repositoryId} className={styles.repoSection}>
            <h2 className={styles.repoTitle}>
              {repo.repositoryOwner}/{repo.repositoryName}
            </h2>

            <ul className={styles.branchList}>
              {repo.branches.map((branch) => (
                <li key={branch.name} className={styles.branchItem}>
                  <Link
                    href={urlgen('projects/[projectId]/ref/[branchOrCommit]', {
                      projectId: project.id.toString(),
                      branchOrCommit: branch.name,
                    })}
                    className={styles.branchName}
                  >
                    {branch.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
