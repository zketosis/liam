import { langfuseLangchainHandler, vectorStore } from '@/lib'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const RETRIEVAL_TEMPLATE = `You are a database design expert. A user is planning to make changes to their database schema and needs advice.

I'll provide you with:
1. The user's query about a database schema change they're planning
2. Relevant context from previous database schema discussions and documentation

Based on this information, please provide a detailed response that:
- Analyzes the proposed schema change
- Offers best practices and recommendations
- Highlights potential issues or considerations
- References specific examples from the context where relevant

User Query:
"""
{query}
"""

Relevant Context:
"""
{context}
"""

Please format your response in Markdown and ensure it's practical, specific, and actionable.`

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Query is not provided or is in an invalid format',
        }),
        { status: 400 },
      )
    }

    const retriever = vectorStore.asRetriever({
      searchType: 'similarity',
      k: 5,
    })

    const relevantDocs = await retriever.invoke(query)
    const context = relevantDocs.map((doc) => doc.pageContent).join('\n\n')

    const prompt = PromptTemplate.fromTemplate(RETRIEVAL_TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: 'gpt-4o-mini',
    })

    const outputParser = new HttpResponseOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    const stream = await chain.stream(
      {
        query: query,
        context: context,
      },
      {
        callbacks: [langfuseLangchainHandler],
      },
    )

    return new Response(stream)
  } catch (error) {
    console.error('Error in retrieve API:', error)
    return new Response(
      JSON.stringify({
        error: 'An error occurred while retrieving knowledge',
      }),
      { status: 500 },
    )
  }
}
