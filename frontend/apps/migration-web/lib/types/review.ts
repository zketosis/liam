export interface ReviewRequest {
  schema: string
}

export interface Document {
  pageContent: string
  metadata: Record<string, unknown>
}
