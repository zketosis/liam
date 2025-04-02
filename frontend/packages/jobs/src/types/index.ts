export type SavePullRequestPayload = {
  prNumber: number
  pullRequestTitle: string
  owner: string
  name: string
  repositoryId: number
  branchName: string
}

export type SavePullRequestWithProjectPayload = {
  prNumber: number
  pullRequestTitle: string
  projectId: number
  branchName: string
}

export type GenerateReviewPayload = {
  pullRequestId: number
  projectId: number
  repositoryId: number
  branchName: string
  owner: string
  name: string
  pullRequestNumber: number
  schemaFiles: Array<{
    filename: string
    content: string
  }>
  fileChanges: Array<{
    filename: string
    status:
      | 'added'
      | 'modified'
      | 'deleted'
      | 'removed'
      | 'renamed'
      | 'copied'
      | 'changed'
      | 'unchanged'
    changes: number
    patch: string
  }>
}

export type ReviewResponse = {
  reviewComment: string
  projectId: number
  pullRequestId: number
  repositoryId: number
  branchName: string
}

export type GenerateSchemaMetaPayload = {
  overallReviewId: number
}

export type SchemaMetaResult = {
  overrides: Record<string, unknown>
  projectId: number
  pullRequestNumber: number
  branchName: string
  title: string
}
