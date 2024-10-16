import type { Meta, StoryObj } from '@storybook/react'

import { aPost } from '../../factories'
import { NavPreviousPost } from './'

const meta = {
  component: NavPreviousPost,
  args: {
    post: aPost(),
  },
} satisfies Meta<typeof NavPreviousPost>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
