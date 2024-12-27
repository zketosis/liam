import { createRequire } from 'node:module'
import path from 'node:path'
import { Command } from 'commander'
import { buildCommand } from './commands/index.js'

const distDir = path.join(process.cwd(), 'dist')

const program = new Command()

const require = createRequire(import.meta.url)
const { version } = require('../../package.json')

program.name('liam').description('CLI tool for Liam').version(version)

const erdCommand = new Command('erd').description('ERD commands')
program.addCommand(erdCommand)

erdCommand
  .command('build')
  .description('Build ERD html assets')
  .option('--input <path|url>', 'Path or URL to the schema file')
  .option('--format <format>', 'Format of the input file (postgres|schemarb)')
  .action((options) => buildCommand(options.input, distDir, options.format))

export { program }
