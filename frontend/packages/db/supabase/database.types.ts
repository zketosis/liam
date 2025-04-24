export type Database = {
  public: {
    Tables: {
      review_feedback_knowledge_suggestion_mappings: {
        Row: {
          id: string
          review_feedback_id: string | null
          knowledge_suggestion_id: string | null
          created_at: string
          updated_at: string
          organization_id: string
        }
        Insert: {
          id?: string
          review_feedback_id?: string | null
          knowledge_suggestion_id?: string | null
          created_at?: string
          updated_at?: string
          organization_id: string
        }
        Update: {
          id?: string
          review_feedback_id?: string | null
          knowledge_suggestion_id?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string
        }
      }
      knowledge_suggestions: {
        Row: {
          id: string
          organization_id: string
        }
        Insert: {
          id?: string
          organization_id: string
        }
        Update: {
          id?: string
          organization_id?: string
        }
      }
      organizations: {
        Row: {
          id: string
        }
      }
    }
  }
}
