import type { Meta, StoryObj } from '@storybook/react'

import { ShareIconButton } from './'

const meta = {
  component: ShareIconButton,
} satisfies Meta<typeof ShareIconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
