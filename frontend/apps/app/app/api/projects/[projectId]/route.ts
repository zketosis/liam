import { getProject } from '@/features/projects/pages/ProjectDetailPage/getProject'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Params = {
  params: Promise<{
    projectId: string
  }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const projectId = (await params).projectId
    const project = await getProject(projectId)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 },
    )
  }
}
