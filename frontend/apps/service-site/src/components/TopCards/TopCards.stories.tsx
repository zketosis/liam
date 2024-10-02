import type { Meta, StoryObj } from '@storybook/react'

import { TopCards } from './'

const meta = {
  component: TopCards,
  args: {
    posts: [],
  },
} satisfies Meta<typeof TopCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
