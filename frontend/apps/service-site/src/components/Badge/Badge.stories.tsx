import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from './Badge'

const meta = {
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
    type: 'default',
  },
}

export const Outline: Story = {
  args: {
    children: 'Badge',
    type: 'outline',
  },
}
