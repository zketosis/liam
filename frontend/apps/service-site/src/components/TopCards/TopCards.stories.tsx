import type { Meta, StoryObj } from '@storybook/react'

import { aPost } from '@/features/posts/factories'
import { TopCards } from './'

const meta = {
  component: TopCards,
  args: {
    posts: Array.from({ length: 14 }, (_, i) => ({
      ...aPost({
        _id: `${i + 1}`,
        title: `${i + 1} The No-Code Revolution: A New Era Where Non-Programmers Can Build Apps`,
      }),
    })),
  },
} satisfies Meta<typeof TopCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
