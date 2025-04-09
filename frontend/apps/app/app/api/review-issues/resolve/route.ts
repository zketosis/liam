import { createClient } from '@/libs/db/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { issueId } = await request.json()

    if (!issueId) {
      return NextResponse.json(
        { message: 'Issue ID is required' },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('ReviewIssue')
      .update({
        resolvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', issueId)
      .select()

    if (error) {
      console.error('Error resolving issue:', error)
      return NextResponse.json(
        { message: 'Failed to resolve issue', error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in resolve API:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 },
    )
  }
}
