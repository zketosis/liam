import { vectorizeUrl } from '@/lib/vectorization'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'URL is not provided or is in an invalid format',
        }),
        { status: 400 },
      )
    }

    const result = await vectorizeUrl(url)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Content vectorized and stored successfully',
        id: result.documentId,
        chunkCount: result.chunkCount,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in vectorize API:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the URL' }),
      { status: 500 },
    )
  }
}
