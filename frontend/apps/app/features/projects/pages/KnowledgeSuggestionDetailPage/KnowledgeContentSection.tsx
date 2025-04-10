'use client'

import { processOverrideContent } from '@/features/projects/actions/processOverrideContent'
import { EditableContent } from '@/features/projects/components/EditableContent'
import type { DBStructure, TableGroup } from '@liam-hq/db-structure'
import type { SupportedFormat } from '@liam-hq/db-structure/parser'
import { type FC, useState } from 'react'
import { ErdViewer } from './ErdViewer'
import styles from './KnowledgeSuggestionDetailPage.module.css'

type ErrorObject = {
  name: string
  message: string
  instruction?: string
}

type ProcessedResult = {
  tableGroups: Record<string, TableGroup>
}

type Props = {
  suggestionContent: string
  suggestionId: number
  originalContent: string | null
  isApproved: boolean
  dbStructure: DBStructure | undefined
  format: SupportedFormat | undefined
  content: string | null
  errors: ErrorObject[]
  tableGroups: Record<string, TableGroup>
}

export const KnowledgeContentSection: FC<Props> = ({
  suggestionContent,
  suggestionId,
  originalContent,
  isApproved,
  dbStructure,
  format,
  content,
  errors,
  tableGroups: initialTableGroups,
}) => {
  const [currentContent, setCurrentContent] = useState(suggestionContent)
  const [processedResult, setProcessedResult] =
    useState<ProcessedResult | null>(null)

  const handleContentSaved = async (savedContent: string) => {
    setCurrentContent(savedContent)

    // Update ErdViewer data with the saved content using server action
    if (dbStructure) {
      const { result } = await processOverrideContent(savedContent, dbStructure)
      setProcessedResult(result)
    }
  }

  return (
    <div className={styles.columns}>
      <div className={styles.contentSection}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Content</h2>
        </div>

        <EditableContent
          content={currentContent}
          suggestionId={suggestionId}
          className={styles.codeContent}
          originalContent={originalContent}
          isApproved={isApproved}
          onContentSaved={handleContentSaved}
        />
      </div>

      {content !== null && format !== undefined && dbStructure && (
        <ErdViewer
          key={JSON.stringify(
            processedResult?.tableGroups || initialTableGroups,
          )}
          dbStructure={dbStructure}
          tableGroups={processedResult?.tableGroups || initialTableGroups || {}}
          errorObjects={errors || []}
          defaultSidebarOpen={false}
        />
      )}
    </div>
  )
}
