import fs from 'node:fs'
import path from 'node:path'

export function runPreprocess(inputPath: string | null, publicDir: string) {
  if (inputPath && !fs.existsSync(inputPath)) {
    throw new Error('Invalid input path. Please provide a valid .sql file.')
  }

  const sqlContent = inputPath ? fs.readFileSync(inputPath, 'utf8') : '{}'
  const filePath = path.join(publicDir, 'schema.json')

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  try {
    const jsonContent = JSON.stringify({ sql: sqlContent }, null, 2)
    fs.writeFileSync(filePath, jsonContent, 'utf8')
    return filePath
  } catch (error) {
    console.error(
      `Error during preprocessing: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    return null
  }
}
