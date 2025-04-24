export interface KnowledgeSuggestionsOverride {
  public: {
    Tables: {
      knowledge_suggestions: {
        Insert: {
          organization_id?: string | null
        }
      }
    }
  }
}
