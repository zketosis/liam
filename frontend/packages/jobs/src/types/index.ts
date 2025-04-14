import type { DBOverride } from '@liam-hq/db-structure'

export type PostCommentPayload = {
  reviewComment: string
  projectId: number
  pullRequestId: number
  repositoryId: number
  branchName: string
  traceId: string
}

export type GenerateSchemaMetaPayload = {
  overallReviewId: number
}

export type SchemaMetaResult =
  | {
      createNeeded: true
      override: DBOverride
      projectId: number
      pullRequestNumber: number
      branchName: string
      title: string
      traceId: string
      overallReviewId: number
      reasoning?: string
    }
  | {
      createNeeded: false
    }
