import type { Meta, StoryObj } from '@storybook/react'

import { getTranslation } from '@/features/i18n'
import { ShareDropdownMenu } from '.'

const { t } = getTranslation('en')

const meta = {
  component: ShareDropdownMenu,
  args: {
    t,
    children: <button type="button">Share</button>,
  },
} satisfies Meta<typeof ShareDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
