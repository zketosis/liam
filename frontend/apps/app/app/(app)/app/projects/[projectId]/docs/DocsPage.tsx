import type { FC } from 'react'

interface DocsPageProps {
  projectId: string
}

export const DocsPage: FC<DocsPageProps> = ({ projectId }) => {
  return (
    <div>
      <h2>Project Documentation</h2>
      <p>This is a placeholder for the project documentation page.</p>
      <p>Project ID: {projectId}</p>
    </div>
  )
}
