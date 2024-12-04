import fs, { readFileSync } from 'node:fs'
import path from 'node:path'
import { type SupportedFormat, parse } from '@liam-hq/db-structure/parser'

export async function runPreprocess(
  inputPath: string,
  outputDir: string,
  format: SupportedFormat,
) {
  if (!fs.existsSync(inputPath)) {
    throw new Error('Invalid input path. Please provide a valid file.')
  }

  const input = readFileSync(inputPath, 'utf8')

  let json = null
  if (
    format === 'schemarb' ||
    format === 'postgres' ||
    format === 'schemarb-prism'
  ) {
    try {
      json = await parse(input, format)
    } catch (error) {
      throw new Error(
        `Failed to parse ${format} file: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  } else {
    throw new Error(
      '--format is missing, invalid, or specifies an unsupported format. Please provide a valid format (e.g., "schemarb" or "postgres").',
    )
  }

  const filePath = path.join(outputDir, 'schema.json')

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
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
