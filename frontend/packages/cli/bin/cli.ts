import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import { build, createServer, preview } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '../..')
const publicDir = path.join(process.cwd(), 'public')
const outDir = path.join(process.cwd(), 'dist')

function runPreprocess(inputPath: string | null) {
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

const program = new Command()

program.name('liam').description('CLI tool for Liam').version('0.0.0')

const erdCommand = new Command('erd').description('ERD commands')

program.addCommand(erdCommand)

erdCommand
  .command('build')
  .description('Run Vite build')
  .option('--input <path>', 'Path to the .sql file')
  .action(async (options) => {
    try {
      const inputPath = options.input
      runPreprocess(inputPath)
      await build({
        publicDir,
        root,
        build: {
          outDir,
          emptyOutDir: false,
        },
      })
    } catch (error) {
      console.error('Build failed:', error)
      process.exit(1)
    }
  })

erdCommand
  .command('dev')
  .description('Run Vite dev server')
  .option('--input <path>', 'Path to the .sql file')
  .action(async (options) => {
    try {
      const inputPath = options.input
      runPreprocess(inputPath)
      const server = await createServer({ publicDir, root })
      const address = server.httpServer?.address()
      const port = typeof address === 'object' && address ? address.port : 5173
      console.info(`Dev server is running at http://localhost:${port}`)
      await server.listen()
    } catch (error) {
      console.error('Failed to start dev server:', error)
      process.exit(1)
    }
  })

erdCommand
  .command('preview')
  .description('Preview the production build')
  .action(async () => {
    try {
      const previewServer = await preview({
        publicDir,
        root,
        build: {
          outDir,
          emptyOutDir: false,
        },
      })
      const address = previewServer.httpServer?.address()
      const port = typeof address === 'object' && address ? address.port : 4173
      console.info(`Preview server is running at http://localhost:${port}`)
    } catch (error) {
      console.error('Failed to start preview server:', error)
      process.exit(1)
    }
  })
program.parse(process.argv)
