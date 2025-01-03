export class CliError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CliError'
  }
}

export class CriticalError extends CliError {
  constructor(message: string) {
    super(message)
    this.name = 'CriticalError'
  }
}
