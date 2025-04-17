'use server'

import { getLastCommit } from '@liam-hq/github'
import { LastCommitInfoClient } from './LastCommitInfoClient'

interface LastCommitInfoProps {
  installationId: number
  owner: string
  repo: string
  defaultDate: string
}

export async function getLastCommitData({
  installationId,
  owner,
  repo,
}: Omit<LastCommitInfoProps, 'defaultDate'>) {
  try {
    const commitInfo = await getLastCommit(installationId, owner, repo)

    if (commitInfo) {
      return {
        author: commitInfo.author,
        date: commitInfo.date,
      }
    }
  } catch (error) {
    console.error('Failed to fetch last commit info:', error)
  }

  return null
}

export async function LastCommitInfo({
  installationId,
  owner,
  repo,
  defaultDate,
}: LastCommitInfoProps) {
  try {
    const commitInfo = await getLastCommit(installationId, owner, repo)

    if (commitInfo) {
      return (
        <LastCommitInfoClient
          author={commitInfo.author}
          date={commitInfo.date}
        />
      )
    }
  } catch (error) {
    console.error('Failed to fetch last commit info:', error)
  }

  return <LastCommitInfoClient date={defaultDate} />
}
