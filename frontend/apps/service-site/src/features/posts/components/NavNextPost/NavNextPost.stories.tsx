import type { Meta, StoryObj } from '@storybook/react'

import { aPost } from '../../factories'
import { NavNextPost } from './'

const meta = {
  component: NavNextPost,
  args: {
    post: aPost(),
  },
} satisfies Meta<typeof NavNextPost>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
