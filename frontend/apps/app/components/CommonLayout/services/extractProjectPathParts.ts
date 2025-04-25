type ProjectPathParts = {
  projectId: string | null
  branchOrCommit: string | null
}

/**
 * Extracts and returns:
 *   - projectId
 *   - branchOrCommit (if available)
 * from paths matching the pattern `/app/projects/<projectId>`.
 *
 * Examples:
 *   '/app/projects/foo'                          -> { projectId: 'foo', branchOrCommit: null }
 *   '/app/projects/foo/ref/main'                -> { projectId: 'foo', branchOrCommit: 'main' }
 *   '/app/projects/foo/ref/feat%2Flogin'        -> { projectId: 'foo', branchOrCommit: 'feat/login' }
 *   '/app' or '/app/projects'                    -> { projectId: null,  branchOrCommit: null }
 */
export function extractProjectPathParts(path: string): ProjectPathParts {
  // 1) Capture projectId as required
  // 2) `/ref/<branchOrCommit>` is optional
  const match = /^\/app\/projects\/([^/]+)(?:\/ref\/([^/]+))?(?:\/|$)/.exec(
    path,
  )

  if (!match) {
    return { projectId: null, branchOrCommit: null }
  }

  const [, rawProjectId, rawBranch] = match
  return {
    projectId: decodeURIComponent(rawProjectId),
    branchOrCommit: rawBranch ? decodeURIComponent(rawBranch) : null,
  }
}
