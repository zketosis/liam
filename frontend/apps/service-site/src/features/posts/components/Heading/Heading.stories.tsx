import type { Meta, StoryObj } from '@storybook/react'

import type { ComponentProps } from 'react'
import { Heading } from '.'

type Props = ComponentProps<typeof Heading>
const StoryComponent = (props: Props) => {
  return <Heading {...props}>What is No-Code?</Heading>
}

const meta = {
  component: StoryComponent,
  args: {
    as: 'h2',
  },
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const H2: Story = {}

export const H3: Story = {
  args: {
    as: 'h3',
  },
}

export const H4: Story = {
  args: {
    as: 'h4',
  },
}
