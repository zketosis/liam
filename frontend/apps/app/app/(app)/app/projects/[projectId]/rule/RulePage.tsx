import type { FC } from 'react'

interface RulePageProps {
  projectId: string
}

export const RulePage: FC<RulePageProps> = ({ projectId }) => {
  return (
    <div>
      <h2>Project Rule</h2>
      <p>This is a placeholder for the project rule page.</p>
      <p>Project ID: {projectId}</p>
    </div>
  )
}
