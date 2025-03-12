import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import type { GenerateReviewPayload, Review } from '../types'

const REVIEW_TEMPLATE = `You are a database design expert. Please analyze the following schema changes and provide a detailed review.

Schema Changes:
{schemaChanges}

Please provide a review in the following format:
1. A summary of the changes and their impact
2. Specific suggestions for improvement
3. Best practices that should be followed

The response must be structured to match this JSON format:
{{
  "summary": "string",
  "suggestions": [
    {{
      "title": "string",
      "description": "string",
      "severity": "low" | "medium" | "high"
    }}
  ],
  "bestPractices": ["string"]
}}`

export async function processGenerateReview(
  payload: GenerateReviewPayload,
): Promise<Review> {
  try {
    const prompt = PromptTemplate.fromTemplate(REVIEW_TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: 'gpt-4o-mini',
    })

    const chain = prompt.pipe(model)
    const response = await chain.invoke({
      schemaChanges: payload.schemaChanges,
    })

    const review: Review = JSON.parse(response.content.toString())
    return review
  } catch (error) {
    console.error('Error generating review:', error)
    throw error
  }
}
