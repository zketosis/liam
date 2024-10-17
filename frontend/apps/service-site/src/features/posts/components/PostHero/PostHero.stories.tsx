import type { Meta, StoryObj } from '@storybook/react'

import { PostHero } from '.'
import { aPost } from '../../factories'

export interface MDX {
  type: string
  code: string
  content: string
  raw: string
  html: string
}

const meta = {
  component: PostHero,
} satisfies Meta<typeof PostHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    lang: 'en',
    post: aPost(),
  },
}
