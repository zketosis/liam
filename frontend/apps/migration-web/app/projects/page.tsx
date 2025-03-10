import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from './page.module.css'

async function getProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      watchFilePath: true,
      description: true,
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
        <h1 className={styles.title}>プロジェクト一覧</h1>
        <Link href="/projects/new" className={styles.createButton}>
          新規プロジェクト作成
        </Link>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className={styles.projectCard}
          >
            <h2>{project.watchFilePath || '名称未設定プロジェクト'}</h2>
            <p>{project.description || '説明なし'}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
