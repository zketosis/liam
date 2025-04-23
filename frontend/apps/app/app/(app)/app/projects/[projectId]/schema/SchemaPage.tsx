import type { FC } from 'react'

interface SchemaPageProps {
  projectId: string
}

export const SchemaPage: FC<SchemaPageProps> = ({ projectId }) => {
  return (
    <div>
      <h2>Project Schema</h2>
      <p>This is a placeholder for the project schema page.</p>
      <p>Project ID: {projectId}</p>
    </div>
  )
}
