export type GenerateReviewPayload = {
  pullRequestNumber: number
  projectId: number
  repositoryId: number
  schemaChanges: Array<{
    filename: string
    status: 'added' | 'modified' | 'deleted'
    changes: number
    patch: string
  }>
}

export type ReviewResponse = {
  reviewComment: string
  projectId: number
  pullRequestId: number
  repositoryId: number
}
