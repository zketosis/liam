export class ProcessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

export class WarningError extends ProcessError {
  constructor(message: string) {
    super(message)
    this.name = 'WarningError'
  }
}
