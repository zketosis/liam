import { getLastCommit } from '@liam-hq/github'

interface LastCommitInfoProps {
  installationId: number
  owner: string
  repo: string
  defaultDate: string
}

export async function LastCommitInfo({
  installationId,
  owner,
  repo,
  defaultDate,
}: LastCommitInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  try {
    const commitInfo = await getLastCommit(installationId, owner, repo)

    if (commitInfo) {
      return (
        <>
          <span>{commitInfo.author}</span>
          <span>committed</span>
          <span>on {formatDate(commitInfo.date)}</span>
        </>
      )
    }
  } catch (error) {
    console.error('Failed to fetch last commit info:', error)
  }

  return (
    <>
      <span>User</span>
      <span>committed</span>
      <span>on {formatDate(defaultDate)}</span>
    </>
  )
}
