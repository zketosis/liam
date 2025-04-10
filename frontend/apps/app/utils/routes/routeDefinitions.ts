export type RouteDefinitions = {
  login: string
  projects: string
  'projects/new': string
  'projects/[projectId]': (params: { projectId: string }) => string
  'projects/[projectId]/migrations': (params: { projectId: string }) => string
  'projects/[projectId]/docs': (params: { projectId: string }) => string
  'organizations/new': string
  organizations: string
  'organizations/[organizationId]': (params: {
    organizationId: string
  }) => string
  'organizations/[organizationId]/projects': (params: {
    organizationId: string
  }) => string
  'organizations/[organizationId]/projects/new': (params: {
    organizationId: string
  }) => string
  'projects/[projectId]/ref/[branchOrCommit]': (params: {
    projectId: string
    branchOrCommit: string
  }) => string
  'projects/[projectId]/ref/[branchOrCommit]/schema/[...schemaFilePath]': (params: {
    projectId: string
    branchOrCommit: string
    schemaFilePath: string
  }) => string
  'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions': (params: {
    projectId: string
    branchOrCommit: string
  }) => string
  'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions/[id]': (params: {
    projectId: string
    branchOrCommit: string
    id: string
  }) => string
  'migrations/[migrationId]': (params: { migrationId: string }) => string
  'projects/[projectId]/ref/[branchOrCommit]/docs/[docFilePath]': (params: {
    projectId: string
    branchOrCommit: string
    docFilePath: string
  }) => string
}

export const routeDefinitions: RouteDefinitions = {
  login: '/app/login',
  projects: '/app/projects',
  'projects/new': '/app/projects/new',
  'organizations/new': '/app/organizations/new',
  organizations: '/app/organizations',
  'organizations/[organizationId]': ({ organizationId }) => {
    return `/app/organizations/${organizationId}`
  },
  'organizations/[organizationId]/projects': ({ organizationId }) => {
    return `/app/organizations/${organizationId}/projects`
  },
  'organizations/[organizationId]/projects/new': ({ organizationId }) => {
    return `/app/organizations/${organizationId}/projects/new`
  },
  'projects/[projectId]': ({ projectId }) => {
    return `/app/projects/${projectId}`
  },
  'projects/[projectId]/migrations': ({ projectId }) => {
    return `/app/projects/${projectId}/migrations`
  },
  'projects/[projectId]/docs': ({ projectId }) => {
    return `/app/projects/${projectId}/docs`
  },
  'projects/[projectId]/ref/[branchOrCommit]': ({
    projectId,
    branchOrCommit,
  }) => {
    const encodedBranchOrCommit = encodeURIComponent(branchOrCommit)
    return `/app/projects/${projectId}/ref/${encodedBranchOrCommit}`
  },
  'projects/[projectId]/ref/[branchOrCommit]/schema/[...schemaFilePath]': ({
    projectId,
    branchOrCommit,
    schemaFilePath,
  }) => {
    const encodedBranchOrCommit = encodeURIComponent(branchOrCommit)
    return `/app/projects/${projectId}/ref/${encodedBranchOrCommit}/schema/${schemaFilePath}`
  },
  'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions': ({
    projectId,
    branchOrCommit,
  }) => {
    const encodedBranchOrCommit = encodeURIComponent(branchOrCommit)
    return `/app/projects/${projectId}/ref/${encodedBranchOrCommit}/knowledge-suggestions`
  },
  'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions/[id]': ({
    projectId,
    branchOrCommit,
    id,
  }) => {
    const encodedBranchOrCommit = encodeURIComponent(branchOrCommit)
    return `/app/projects/${projectId}/ref/${encodedBranchOrCommit}/knowledge-suggestions/${id}`
  },
  'migrations/[migrationId]': ({ migrationId }) => {
    return `/app/migrations/${migrationId}`
  },
  'projects/[projectId]/ref/[branchOrCommit]/docs/[docFilePath]': ({
    projectId,
    branchOrCommit,
    docFilePath,
  }) => {
    const encodedBranchOrCommit = encodeURIComponent(branchOrCommit)
    return `/app/projects/${projectId}/ref/${encodedBranchOrCommit}/docs/${docFilePath}`
  },
} as const
