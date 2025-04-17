import type { Tables } from '@liam-hq/db/supabase/database.types'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // This is a mock implementation. In a real app, you would fetch projects from a database.
    const projects = await getProjects()

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error in projects API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    )
  }
}

// Mock function to get all projects
// In a real app, this would query a database
async function getProjects(): Promise<Tables<'Project'>[]> {
  // Simulate database lookup
  const mockProjects: Tables<'Project'>[] = [
    {
      id: 1,
      name: 'E-commerce Platform',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 1,
    },
    {
      id: 2,
      name: 'CRM System',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 1,
    },
    {
      id: 3,
      name: 'Analytics Dashboard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 2,
    },
  ]

  return mockProjects
}
