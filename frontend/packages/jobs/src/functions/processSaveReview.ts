import { prisma } from '@liam-hq/db'
import type { ReviewResponse } from '../types'

export const processSaveReview = async (
  payload: ReviewResponse,
): Promise<{ success: boolean }> => {
  try {
    const pullRequest = await prisma.pullRequest.findUnique({
      where: {
        id: payload.pullRequestId,
      },
    })

    if (!pullRequest) {
      throw new Error('PullRequest not found')
    }

    const now = new Date()

    // create overall review
    await prisma.overallReview.create({
      data: {
        projectId: payload.projectId,
        pullRequestId: pullRequest.id,
        reviewComment: payload.review.bodyMarkdown,
        branchName: payload.branchName,
        updatedAt: now,
        reviewScores: {
          create: payload.review.scores.map((score) => ({
            overallScore: score.value,
            category: mapCategoryEnum(score.kind),
            reason: score.reason,
            updatedAt: now,
          })),
        },
        reviewIssues: {
          create: payload.review.issues.map((issue) => ({
            category: mapCategoryEnum(issue.kind),
            severity: mapSeverityEnum(issue.severity),
            description: issue.description,
            updatedAt: now,
          })),
        },
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error saving review:', error)
    throw error
  }
}

// Helper function to map category from review schema to CategoryEnum
const mapCategoryEnum = (
  category: string,
):
  | 'MIGRATION_SAFETY'
  | 'DATA_INTEGRITY'
  | 'PERFORMANCE_IMPACT'
  | 'PROJECT_RULES_CONSISTENCY'
  | 'SECURITY_OR_SCALABILITY' => {
  const mapping: Record<
    string,
    | 'MIGRATION_SAFETY'
    | 'DATA_INTEGRITY'
    | 'PERFORMANCE_IMPACT'
    | 'PROJECT_RULES_CONSISTENCY'
    | 'SECURITY_OR_SCALABILITY'
  > = {
    'Migration Safety': 'MIGRATION_SAFETY',
    'Data Integrity': 'DATA_INTEGRITY',
    'Performance Impact': 'PERFORMANCE_IMPACT',
    'Project Rules Consistency': 'PROJECT_RULES_CONSISTENCY',
    'Security or Scalability': 'SECURITY_OR_SCALABILITY',
  }
  const result = mapping[category]
  if (!result) {
    throw new Error(`Invalid category: ${category}`)
  }
  return result
}

// Helper function to map severity from review schema to SeverityEnum
const mapSeverityEnum = (
  severity: string,
): 'CRITICAL' | 'WARNING' | 'POSITIVE' => {
  const mapping: Record<string, 'CRITICAL' | 'WARNING' | 'POSITIVE'> = {
    high: 'CRITICAL',
    medium: 'WARNING',
    low: 'POSITIVE',
  }
  const result = mapping[severity]
  if (!result) {
    throw new Error(`Invalid severity: ${severity}`)
  }
  return result
}
