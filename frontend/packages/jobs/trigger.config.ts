import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin'
import * as Sentry from '@sentry/node'
import { esbuildPlugin } from '@trigger.dev/build/extensions'
import { prismaExtension } from '@trigger.dev/build/extensions/prisma'
import { defineConfig } from '@trigger.dev/sdk/v3'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' })
}

dotenv.config({ path: '.env' })

const triggerProjectId = process.env.TRIGGER_PROJECT_ID || 'project-id'

export default defineConfig({
  project: triggerProjectId,
  runtime: 'node',
  logLevel: 'log',
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    extensions: [
      prismaExtension({
        schema: '../../packages/db/prisma/schema.prisma',
      }),
      esbuildPlugin(
        sentryEsbuildPlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
        { placement: 'last', target: 'deploy' },
      ),
    ],
    external: ['uuid'],
  },
  init: async () => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      tracesSampleRate: 1,

      debug: false,

      environment: process.env.NEXT_PUBLIC_ENV_NAME,
    })
  },
  onFailure: async (payload, error, { ctx }) => {
    Sentry.captureException(error, {
      extra: {
        payload,
        ctx,
      },
    })
  },
  dirs: ['./src/trigger'],
})
