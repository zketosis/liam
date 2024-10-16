import type { Meta, StoryObj } from '@storybook/react'

import { Blockquote } from './Blockquote'

const meta = {
  component: Blockquote,
} satisfies Meta<typeof Blockquote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children:
      '"You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete."',
  },
}
