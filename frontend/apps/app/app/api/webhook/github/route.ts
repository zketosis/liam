import crypto from 'node:crypto'
import { savePullRequestTask } from '@/src/trigger/jobs'
import { prisma } from '@liam-hq/db'
import { supportedEvents, validateConfig } from '@liam-hq/github'
import type { GitHubWebhookPayload } from '@liam-hq/github'
import { type NextRequest, NextResponse } from 'next/server'
import { checkSchemaChanges } from './utils/checkSchemaChanges'

const verifyWebhookSignature = (
  payload: string,
  signature: string,
): boolean => {
  const hmac = crypto.createHmac(
    'sha256',
    process.env.GITHUB_WEBHOOK_SECRET || '',
  )
  const digest = `sha256=${hmac.update(payload).digest('hex')}`

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const payload = await request.text()

    // NOTE: Don't verify signature in local development
    if (process.env.VERCEL === '1') {
      const signature = request.headers.get('x-hub-signature-256') ?? ''
      const isValid = verifyWebhookSignature(payload, signature)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 },
        )
      }
    }

    const data = JSON.parse(payload) as GitHubWebhookPayload
    const event = request.headers.get('x-github-event') ?? ''
    const action = data.action
    const eventType = `${event}.${action}`

    if (!supportedEvents.includes(eventType)) {
      return NextResponse.json(
        { message: `Event ${eventType} is not supported` },
        { status: 200 },
      )
    }

    try {
      if (event === 'pull_request') {
        const pullRequest = data.pull_request
        if (!pullRequest) {
          throw new Error('Pull request data is missing')
        }

        const repository = await prisma.repository.findFirst({
          where: {
            installationId: data.installation.id,
          },
        })
        if (!repository) {
          throw new Error('Repository not found')
        }

        const projectRepositoryMapping =
          await prisma.projectRepositoryMapping.findFirst({
            where: {
              repositoryId: repository.id,
            },
          })
        if (!projectRepositoryMapping) {
          throw new Error('Mapping not found')
        }
        const projectId = projectRepositoryMapping.projectId

        switch (action) {
          case 'opened':
          case 'synchronize':
          case 'reopened': {
            // Perform pre-check
            const checkResult = await checkSchemaChanges({
              installationId: data.installation.id,
              pullRequestNumber: pullRequest.number,
              pullRequestTitle: pullRequest.title,
              projectId,
              owner: data.repository.owner.login,
              name: data.repository.name,
            })

            // Determine whether to continue processing based on the check results
            if (!checkResult.shouldContinue) {
              return NextResponse.json(
                { message: 'No schema changes to review' },
                { status: 200 },
              )
            }
            // Queue the savePullRequest task
            await savePullRequestTask.trigger({
              pullRequestNumber: pullRequest.number,
              pullRequestTitle: pullRequest.title,
              projectId,
              owner: data.repository.owner.login,
              name: data.repository.name,
              repositoryId: repository.id,
            })

            return NextResponse.json(
              { message: 'Pull request processing initiated' },
              { status: 200 },
            )
          }
          default:
            throw new Error(`Unsupported pull request action: ${action}`)
        }
      }

      return NextResponse.json(
        { message: `Event ${eventType} is supported but no handler found` },
        { status: 200 },
      )
    } catch (error) {
      console.error(`Error handling ${eventType} event:`, error)
      return NextResponse.json(
        { error: `Failed to process ${eventType} event` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 },
    )
  }
}
