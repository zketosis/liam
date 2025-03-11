import { validateConfig } from '@/libs/github/config'
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }

  const { valid, missing } = validateConfig()
  if (!valid) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }
}

export const onRequestError = Sentry.captureRequestError
