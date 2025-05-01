import type { FC } from 'react'

interface SettingsPageProps {
  projectId: string
}

export const SettingsPage: FC<SettingsPageProps> = ({ projectId }) => {
  return (
    <div>
      <h2>Project Settings</h2>
      <p>This is a placeholder for the project settings page.</p>
      <p>Project ID: {projectId}</p>
    </div>
  )
}
