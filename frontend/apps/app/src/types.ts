export interface GenerateReviewPayload {
  prNumber: number
  repositoryId: string
  schemaChanges: string
}

export interface Review {
  summary: string
  suggestions: Suggestion[]
  bestPractices: string[]
}

export interface Suggestion {
  title: string
  description: string
  severity: string
}

export interface GenerateReviewPayload {
  prNumber: number
  repositoryId: string
  schemaChanges: string
}
