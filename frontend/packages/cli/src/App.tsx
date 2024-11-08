import { ERDRenderer } from '@liam/erd-core'
import { useEffect, useState } from 'react'

function App() {
  const [fileContent, setFileContent] = useState<string | null>(null)

  useEffect(() => {
    async function loadSchemaContent() {
      const response = await fetch('/schema.json')
      const data = (await response.json()) || 'No file content available'
      setFileContent(JSON.stringify(data, null, 2))
    }

    loadSchemaContent()
  }, [])

  return (
    <>
      <ERDRenderer />

      {/* TODO: Remove this */}
      {/* Display the file content in a pre tag for demo purposes */}
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {fileContent || 'Loading...'}
      </pre>
    </>
  )
}

export default App
