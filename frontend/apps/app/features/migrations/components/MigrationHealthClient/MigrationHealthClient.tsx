'use client'

import { useReviewIssues } from '../../contexts/ReviewIssuesContext'
import { calculateScoresFromIssues } from '../../utils/calculateScores'
import { RadarChart } from '../RadarChart/RadarChart'
import styles from './MigrationHealthClient.module.css'

type MigrationHealthClientProps = {
  className?: string
}

export const MigrationHealthClient = ({
  className,
}: MigrationHealthClientProps) => {
  // Use the shared context instead of local state
  const { issues } = useReviewIssues()

  // Calculate scores from issues
  const scores = calculateScoresFromIssues(issues)

  return (
    <div className={className}>
      {issues && issues.length > 0 ? (
        <div className={styles.radarChartContainer}>
          <RadarChart scores={scores} />
        </div>
      ) : (
        <p className={styles.noScores}>No review issues found.</p>
      )}
    </div>
  )
}
