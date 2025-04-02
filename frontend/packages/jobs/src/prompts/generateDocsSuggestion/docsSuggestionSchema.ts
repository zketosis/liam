import { object, string } from 'valibot'

export const docsSuggestionSchema = object({
  schemaPatterns: string(),
  schemaContext: string(),
  migrationPatterns: string(),
  migrationOpsContext: string(),
  liamrules: string(),
})
