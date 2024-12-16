import { createRequire } from 'node:module'
import type { Command } from 'commander'
import { describe, expect, it, vi } from 'vitest'
import { buildCommand } from './commands/index.js'
import { program } from './index.js'

// Function to set up mocks
function setupMocks() {
  vi.mock('./commands/buildCommand', () => ({
    buildCommand: vi.fn(),
  }))
}

// Utility function to find a subcommand
function findSubCommand(erdCommand: Command | undefined, name: string) {
  return erdCommand?.commands.find((cmd: Command) => cmd.name() === name)
}

setupMocks()

describe('program', () => {
  it('should have the correct name and description', () => {
    expect(program.name()).toBe('liam')
    expect(program.description()).toBe('CLI tool for Liam')
    const require = createRequire(import.meta.url)
    const { version: packageVersion } = require('../../package.json')
    expect(program.version()).toBe(packageVersion)
  })

  it('should have an "erd" command with subcommands', () => {
    const erdCommand = program.commands.find((cmd) => cmd.name() === 'erd')
    expect(erdCommand).toBeDefined()
    expect(erdCommand?.description()).toBe('ERD commands')

    // Verify subcommands
    const buildSubCommand = findSubCommand(erdCommand, 'build')
    expect(buildSubCommand).toBeDefined()
    expect(buildSubCommand?.description()).toBe('Build ERD html assets')
  })

  describe('commands', () => {
    it.each([['schemarb'], ['postgres']])(
      'should call buildCommand with correct arguments for format %s',
      (format) => {
        const inputFile = './fixtures/input.schema.rb'

        program.parse(
          ['erd', 'build', '--input', inputFile, '--format', format],
          {
            from: 'user',
          },
        )

        expect(buildCommand).toHaveBeenCalledWith(
          inputFile,
          expect.stringContaining('dist'),
          format,
        )
      },
    )
  })
})
