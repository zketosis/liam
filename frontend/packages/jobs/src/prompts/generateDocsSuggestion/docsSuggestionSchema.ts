import { type InferOutput, boolean, object, optional, string } from 'valibot'

// Define a common evaluation object structure
const fileEvaluationSchema = object({
  updateNeeded: boolean(),
  reasoning: string(),
  suggestedChanges: string(),
})

// Evaluation schema to determine which files need updates
export const evaluationSchema = object({
  schemaPatterns: fileEvaluationSchema,
  schemaContext: fileEvaluationSchema,
  migrationPatterns: fileEvaluationSchema,
  migrationOpsContext: fileEvaluationSchema,
  liamrules: fileEvaluationSchema,
})

// Updated schema with optional fields
export const docsSuggestionSchema = object({
  schemaPatterns: optional(string()),
  schemaContext: optional(string()),
  migrationPatterns: optional(string()),
  migrationOpsContext: optional(string()),
  liamrules: optional(string()),
})

// Define types for easier usage
export type EvaluationResult = InferOutput<typeof evaluationSchema>
export type DocsSuggestion = InferOutput<typeof docsSuggestionSchema>
