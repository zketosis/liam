import type { Meta, StoryObj } from '@storybook/react'

import { aPost } from '../../factories'
import { PostWriter } from './PostWriter'

export interface MDX {
  type: string
  code: string
  content: string
  raw: string
  html: string
}

const meta = {
  component: PostWriter,
} satisfies Meta<typeof PostWriter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    post: aPost(),
  },
}
