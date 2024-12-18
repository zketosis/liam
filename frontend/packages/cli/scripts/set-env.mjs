import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const packageJson = JSON.parse(
  await (await import('node:fs/promises')).readFile(
    join(__dirname, '../package.json'),
    'utf-8',
  ),
)
const gitHash = (() => {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch (error) {
    console.error('Failed to get git hash:', error)
    return ''
  }
})()

const date = (() => {
  try {
    const gitDate = execSync('git log -1 --format=%ci').toString().trim()
    return gitDate.split(' ')[0]
  } catch (error) {
    console.error('Failed to get git date:', error)
    return new Date().toISOString().split('T')[0] // fallback to current date
  }
})()

const packageJsonVersion = packageJson.version
const latestTagName = `@liam-hq/cli@${packageJsonVersion}`
const isReleasedGitHash = (() => {
  try {
    execSync('git fetch --tags')
    const tagCommit = execSync(`git rev-parse ${latestTagName}`)
      .toString()
      .trim()
    if (gitHash === tagCommit) {
      return 1
    }
    return 0
  } catch (error) {
    console.error('Failed to get git tag:', error)
    return 0
  }
})()

process.env.VITE_CLI_VERSION_VERSION = packageJsonVersion
process.env.VITE_CLI_VERSION_IS_RELEASED_GIT_HASH = isReleasedGitHash
process.env.VITE_CLI_VERSION_GIT_HASH = gitHash
process.env.VITE_CLI_VERSION_DATE = date

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('No command provided to run with the environment variable.')
  process.exit(1)
}

const command = args.join(' ')

execSync(command, { stdio: 'inherit', env: process.env })
