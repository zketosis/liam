import type { Meta, StoryObj } from '@storybook/react'

import type { ComponentProps } from 'react'
import { PostCategories } from './PostCategories'

type Props = ComponentProps<typeof PostCategories>
const StoryComponent = (props: Props) => {
  return <PostCategories {...props}>Categories</PostCategories>
}

export default {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export const Default: StoryObj<typeof StoryComponent> = {
  args: {
    categories: [
      { name: 'No-Code' },
      { name: 'Technology' },
      { name: 'DX' },
      { name: 'Innovation' },
      { name: 'Startups' },
    ],
  },
}
