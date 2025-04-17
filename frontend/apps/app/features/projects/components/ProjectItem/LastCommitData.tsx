'use server'

import { getLastCommit } from '@liam-hq/github'

// サーバーアクションとしてデータ取得関数を定義
export async function fetchLastCommitData(
  installationId: number,
  owner: string,
  repo: string,
) {
  try {
    if (!installationId || !owner || !repo) {
      return null
    }

    const commitInfo = await getLastCommit(installationId, owner, repo)

    if (commitInfo) {
      return {
        author: commitInfo.author,
        date: commitInfo.date,
      }
    }

    return null
  } catch (error) {
    console.error('Failed to fetch last commit info:', error)
    return null
  }
}
