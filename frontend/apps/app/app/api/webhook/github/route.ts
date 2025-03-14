import { verifyWebhookSignature } from '@/libs/github/api.server'
import { supportedEvents, validateConfig } from '@/libs/github/config'
import { handleInstallation } from '@/libs/github/webhooks/installation'
import { savePullRequestTask } from '@/src/trigger/jobs'
import type { GitHubWebhookPayload } from '@/types/github'
import { prisma } from '@liam-hq/db'
import { type NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-hub-signature-256') ?? ''

    const isValid = verifyWebhookSignature(payload, signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
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

        switch (action) {
          case 'opened':
          case 'synchronize':
          case 'reopened': {
            // Queue the savePullRequest task
            await savePullRequestTask.trigger({
              pullRequestNumber: pullRequest.number,
              pullRequestTitle: pullRequest.title,
              projectId: undefined,
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

      if (event === 'installation') {
        const result = await handleInstallation(data)
        return NextResponse.json(result, { status: 200 })
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
