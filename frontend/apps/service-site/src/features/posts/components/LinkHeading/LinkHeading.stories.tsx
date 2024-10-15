import type { Meta, StoryObj } from '@storybook/react'

import type { ComponentProps } from 'react'
import { LinkHeading } from './LinkHeading'

type Props = ComponentProps<typeof LinkHeading>
const StoryComponent = (props: Props) => {
  return <LinkHeading {...props}>Categories</LinkHeading>
}

export default {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export const WithHref: StoryObj<typeof StoryComponent> = {
  args: {
    href: '#categories',
  },
}

export const WithoutHref: StoryObj<typeof StoryComponent> = {
  args: {
    href: undefined,
  },
}
