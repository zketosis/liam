import type { Meta, StoryObj } from '@storybook/react'

import { ShareIcon } from '.'

const meta = {
  component: ShareIcon,
} satisfies Meta<typeof ShareIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
