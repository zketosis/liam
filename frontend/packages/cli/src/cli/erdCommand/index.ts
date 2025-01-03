import path from 'node:path'
import { Command } from 'commander'
import { red } from 'yoctocolors'
import { CriticalError } from '../errors.js'
import { buildCommand } from './buildCommand/index.js'

const distDir = path.join(process.cwd(), 'dist')

const erdCommand = new Command('erd').description('ERD commands')

function actionErrorHandler(error: Error) {
  console.error(red(`ERROR: ${error.message}`))
}

export function actionRunner<T>(fn: (args: T) => Promise<Error[]>) {
  return async (args: T) => {
    const errors = await fn(args)
    if (errors.length > 0) {
      errors.forEach(actionErrorHandler)
    }

    if (errors.some((error) => error instanceof CriticalError)) {
      process.exit(1)
    }
  }
}

erdCommand
  .command('build')
  .description('Build ERD html assets')
  .option('--input <path|url>', 'Path or URL to the schema file')
  .option('--format <format>', 'Format of the input file (postgres|schemarb)')
  .action(
    actionRunner((options) =>
      buildCommand(options.input, distDir, options.format),
    ),
  )

export { erdCommand }
