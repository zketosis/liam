'use client'

interface LastCommitInfoClientProps {
  author?: string
  date: string
}

export function LastCommitInfoClient({
  author = 'User',
  date,
}: LastCommitInfoClientProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <>
      <span>{author}</span>
      <span>committed</span>
      <span>on {formatDate(date)}</span>
    </>
  )
}
