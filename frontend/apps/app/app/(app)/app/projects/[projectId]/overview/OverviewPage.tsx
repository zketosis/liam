import type { FC } from 'react'

interface OverviewPageProps {
  projectId: string
}

export const OverviewPage: FC<OverviewPageProps> = ({ projectId }) => {
  return (
    <div>
      <h2>Project Overview</h2>
      <p>This is a placeholder for the project overview page.</p>
      <p>Project ID: {projectId}</p>
    </div>
  )
}
