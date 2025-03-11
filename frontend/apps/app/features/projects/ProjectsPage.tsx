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
        <h1 className={styles.title}>プロジェクト一覧</h1>
        <Link href="/projects/new" className={styles.createButton}>
          新規プロジェクト作成
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <p>まだプロジェクトが登録されていません。</p>
          <p>新規作成からプロジェクトを作成してください。</p>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={styles.projectCard}
            >
              <h2>{project.name || '名称未設定プロジェクト'}</h2>
              <p className={styles.createdAt}>
                作成日: {project.createdAt.toLocaleDateString('ja-JP')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
