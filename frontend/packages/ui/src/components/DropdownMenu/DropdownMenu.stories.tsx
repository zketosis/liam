import type { Meta, StoryObj } from '@storybook/react'

import { DropdownMenu } from './'

const meta = {
  component: DropdownMenu,
  args: {},
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
