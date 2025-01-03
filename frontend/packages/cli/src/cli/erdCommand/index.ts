import path from 'node:path'
import { Command } from 'commander'
import { red, yellow } from 'yoctocolors'
import { CriticalError, WarningError } from '../errors.js'
import { buildCommand } from './buildCommand/index.js'

const distDir = path.join(process.cwd(), 'dist')

const erdCommand = new Command('erd').description('ERD commands')

function actionErrorHandler(error: Error) {
  if (error instanceof CriticalError) {
    console.error(red(`ERROR: ${error.message}`))
    return
  }

  if (error instanceof WarningError) {
    console.warn(yellow(`WARN: ${error.message}`))
    return
  }
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
