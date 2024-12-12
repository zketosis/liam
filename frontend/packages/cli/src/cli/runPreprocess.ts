import fs from 'node:fs'
import path from 'node:path'
import {
  type SupportedFormat,
  parse,
  supportedFormatSchema,
} from '@liam-hq/db-structure/parser'
import * as v from 'valibot'
import { getInputContent } from './getInputContent.js'

export async function runPreprocess(
  inputPath: string,
  outputDir: string,
  format: SupportedFormat,
) {
  const input = await getInputContent(inputPath)

  if (!v.safeParse(supportedFormatSchema, format).success) {
    throw new Error(
      '--format is missing, invalid, or specifies an unsupported format. Please provide a valid format (e.g., "schemarb" or "postgres").',
    )
  }

  const { value: json, errors } = await parse(input, format)
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error)
    }
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
