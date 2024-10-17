import type { Meta, StoryObj } from '@storybook/react'

import type { ComponentProps } from 'react'
import { PostTags } from './PostTags'

type Props = ComponentProps<typeof PostTags>
const StoryComponent = (props: Props) => {
  return <PostTags {...props}>Categories</PostTags>
}

export default {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export const Default: StoryObj<typeof StoryComponent> = {
  args: {
    tags: [
      { name: 'No-Code' },
      { name: 'Technology' },
      { name: 'DX' },
      { name: 'Innovation' },
      { name: 'Startups' },
    ],
  },
}
