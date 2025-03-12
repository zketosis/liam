import { verifyWebhookSignature } from '@/libs/github/api'
import { supportedEvents, validateConfig } from '@/libs/github/config'
import { handleInstallation } from '@/libs/github/webhooks/installation'
import { handlePullRequest } from '@/libs/github/webhooks/pull-request'
import type { GitHubWebhookPayload } from '@/types/github'
import { type NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const payload = await request.text()

    const signature = request.headers.get('x-hub-signature-256') || ''
    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(payload) as GitHubWebhookPayload

    const event = request.headers.get('x-github-event') || ''
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
        const result = await handlePullRequest(data)
        return NextResponse.json(result, { status: 200 })
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
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
