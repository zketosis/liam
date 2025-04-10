'use client'

import type { CategoryEnum } from '../components/RadarChart/RadarChart'

export type ReviewIssueForScore = {
  category: string
  severity: string
  resolvedAt?: string | null
}

export type CalculatedScore = {
  id: number
  overallReviewId: number
  overallScore: number
  category: CategoryEnum
}

/**
 * Calculates scores from review issues, excluding resolved issues
 */
export const calculateScoresFromIssues = (
  issues: ReviewIssueForScore[],
): CalculatedScore[] => {
  // Group issues by category
  const issuesByCategory = issues.reduce<
    Record<string, Array<{ severity: string; resolvedAt?: string | null }>>
  >((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = []
    }
    acc[issue.category].push({
      severity: issue.severity,
      resolvedAt: issue.resolvedAt,
    })
    return acc
  }, {})

  // Calculate scores for each category
  return Object.entries(issuesByCategory).map(([category, categoryIssues]) => {
    // Start with 10 points
    let score = 10

    // Calculate deductions based on issue severity (only for unresolved issues)
    for (const issue of categoryIssues) {
      if (issue.resolvedAt) continue // Skip resolved issues

      if (issue.severity === 'CRITICAL') {
        score -= 3
      } else if (issue.severity === 'WARNING') {
        score -= 1
      }
      // No deduction for POSITIVE feedback
    }

    // Ensure minimum score is 0
    score = Math.max(0, score)

    return {
      id: Number.parseInt(category, 10), // Use category as ID
      overallReviewId: 0, // Not needed anymore
      overallScore: score,
      category: category as CategoryEnum,
    }
  })
}
