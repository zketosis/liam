import type { Meta, StoryObj } from '@storybook/react'

import { TopCards } from './'

const commonPostData = (postId: number) => ({
  id: `${postId}`,
  title: 'The No-Code Revolution: A New Era Where Non-Programmers Can Build Apps',
  tags: ['Democratization', 'Empowerment', 'Innovation', 'Agility', 'Disruption'],
  writer: 'Aiden Sparks',
  introduction: "The rise of no-code application platforms is changing the landscape of software development. These platforms allow users with little to no coding knowledge to create fully functional applications, reducing the barrier to entry for innovation. The convenience, flexibility, and speed offered by no-code tools are helping businesses of all sizes innovate at unprecedented rates.",
  image: `/images/posts/${postId}/image.png`,
});

const meta = {
  component: TopCards,
  args: {
    posts: Array.from({ length: 14 }, (_, i) => ({
      ...commonPostData(i + 1),
      _id: (i + 1).toString(),
    })),
  },
} satisfies Meta<typeof TopCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
