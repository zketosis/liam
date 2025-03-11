import { prisma } from '@liam-hq/db'
import Link from 'next/link'
import styles from './ProjectsPage.module.css'

async function getProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      id: 'desc',
    },
  })
  return projects
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <Link href="/projects/new" className={styles.createButton}>
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No projects found.</p>
          <p>Create a new project to get started.</p>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={styles.projectCard}
            >
              <h2>{project.name || 'Untitled Project'}</h2>
              <p className={styles.createdAt}>
                Created: {project.createdAt.toLocaleDateString('en-US')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
