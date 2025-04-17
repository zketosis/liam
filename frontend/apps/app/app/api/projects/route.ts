import type { Tables } from '@liam-hq/db/supabase/database.types'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // This is a mock implementation. In a real app, you would fetch projects from a database.
    const projects = await getProjects()

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: 'Invalid projects data format' },
        { status: 500 },
      )
    }

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
      name: 'Liam HQ',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 1,
    },
    {
      id: 2,
      name: 'Dashboard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 1,
    },
    {
      id: 3,
      name: 'API Service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 1,
    },
    {
      id: 4,
      name: 'Mobile App',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 2,
    },
    {
      id: 5,
      name: 'Analytics Platform',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 2,
    },
    {
      id: 6,
      name: 'Enterprise Resource Planning System Development Project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 3,
    },
    {
      id: 7,
      name: 'Customer Relationship Management Platform Integration',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 3,
    },
    {
      id: 8,
      name: 'Mobile Application Development for Cross-Platform Deployment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 4,
    },
    {
      id: 9,
      name: 'Data Analytics and Business Intelligence Dashboard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 4,
    },
    {
      id: 10,
      name: 'Cloud Infrastructure Migration and Optimization Project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 5,
    },
  ]

  return mockProjects
}
