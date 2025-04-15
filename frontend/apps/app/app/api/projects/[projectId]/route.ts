'use server'

import { createClient } from '@/libs/db/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { projectId: string } },
) {
  try {
    const projectId = params.projectId
    const supabase = await createClient()
    const { data: project, error } = await supabase
      .from('Project')
      .select(`
        id,
        name,
        createdAt,
        organizationId
      `)
      .eq('id', Number(projectId))
      .single()

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
