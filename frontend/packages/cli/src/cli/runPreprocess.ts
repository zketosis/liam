import fs, { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from '@liam/db-structure'

export function runPreprocess(inputPath: string, publicDir: string) {
  if (!fs.existsSync(inputPath)) {
    throw new Error('Invalid input path. Please provide a valid file.')
  }

  const input = readFileSync(inputPath, 'utf8')

  // TODO: Expand support to additional formats, e.g., 'postgres'
  const format = 'schemarb'
  const json = parse(input, format)

  const filePath = path.join(publicDir, 'schema.json')

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  try {
    const jsonContent = JSON.stringify(json, null, 2)
    fs.writeFileSync(filePath, jsonContent, 'utf8')
    return filePath
  } catch (error) {
    console.error(
      `Error during preprocessing: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    return null
  }
}
