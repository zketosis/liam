/**
 * Formats a review issue into a standardized prompt format
 */
export function formatReviewIssue({
  category,
  severity,
  description,
  suggestion,
  snippets,
}: {
  category: string
  severity: string
  description: string
  suggestion: string
  snippets?: Array<{
    filename: string
    snippet: string
  }>
}): string {
  let formattedText = `Please optimize the code based on the following Review Issue:

Category: ${category}
Severity: ${severity}
Issue: ${description}
Suggestion: ${suggestion}`

  // Add code snippets if they exist
  if (snippets && snippets.length > 0) {
    formattedText += '\n\n'

    for (const snippet of snippets) {
      formattedText += `// ${snippet.filename}\n${snippet.snippet}\n\n`
    }
  }

  return formattedText
}

/**
 * Formats all review issues into a single text
 */
export function formatAllReviewIssues(
  issues: Array<{
    id: number
    category: string
    severity: string
    description: string
    suggestion: string
    suggestionSnippets: Array<{
      id: number
      filename: string
      snippet: string
    }>
  }>,
): string {
  if (issues.length === 0) {
    return 'No review issues found.'
  }

  return issues
    .map((issue) =>
      formatReviewIssue({
        category: issue.category,
        severity: issue.severity,
        description: issue.description,
        suggestion: issue.suggestion,
        snippets: issue.suggestionSnippets.map((snippet) => ({
          filename: snippet.filename,
          snippet: snippet.snippet,
        })),
      }),
    )
    .join('\n\n---\n\n')
}
