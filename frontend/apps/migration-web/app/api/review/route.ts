import { langfuseLangchainHandler, vectorStore } from '@/lib'
import type { Document, ReviewRequest } from '@/lib/types/review'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const REVIEW_TEMPLATE = `You are a database design expert. Please analyze the following database schema and provide a detailed review based on our migration documents and relevant context.

Relevant Knowledge Base Context:
{context}

Include the following points in your review:
1. Overall evaluation of the schema
2. Issues with table design (normalization, naming conventions, etc.)
3. Evaluation and recommendations for index design
4. Performance concerns
5. Security concerns
6. Specific suggestions for improvement based on our migration documents

Schema:
"""
{schema}
"""

Please output the review results in Markdown format in English.`

export async function POST(req: NextRequest) {
  try {
    const request: ReviewRequest = await req.json()

    if (!request.schema || typeof request.schema !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Schema is not provided or is in an invalid format',
        }),
        { status: 400 },
      )
    }

    // search context
    const retriever = vectorStore.asRetriever({
      searchType: 'similarity',
      k: 5,
    })

    const relevantDocs = await retriever.invoke(request.schema)
    const context = relevantDocs
      .map((doc: Document) => doc.pageContent)
      .join('\n\n')

    const prompt = PromptTemplate.fromTemplate(REVIEW_TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: 'gpt-4o-mini',
    })

    const outputParser = new HttpResponseOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    const stream = await chain.stream(
      {
        schema: request.schema,
        context: context,
      },
      {
        callbacks: [langfuseLangchainHandler],
      },
    )

    return new Response(stream)
  } catch (error) {
    console.error('Error in review API:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred while reviewing the schema' }),
      { status: 500 },
    )
  }
}
