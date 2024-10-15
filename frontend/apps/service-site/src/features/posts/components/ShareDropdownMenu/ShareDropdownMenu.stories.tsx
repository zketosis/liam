import type { Meta, StoryObj } from '@storybook/react'

import { ShareDropdownMenu } from '.'

const meta = {
  component: ShareDropdownMenu,
  args: {
    lang: 'en',
    children: <button type="button">Share</button>,
  },
} satisfies Meta<typeof ShareDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
