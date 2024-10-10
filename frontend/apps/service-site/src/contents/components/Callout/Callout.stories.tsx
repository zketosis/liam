import type { Meta, StoryObj } from '@storybook/react'

import type { ComponentProps } from 'react'
import { Callout } from './'

type Props = ComponentProps<typeof Callout>

const StoryComponent = (props: Props) => {
  return (
    <Callout {...props}>
      No-code platforms are breaking down the barriers to innovation, allowing
      anyone with an idea to bring it to life without needing to write a single
      line of code.
    </Callout>
  )
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Danger: Story = {
  args: {
    type: 'danger',
  },
}

export const Success: Story = {
  args: {
    type: 'success',
  },
}

export const Info: Story = {
  args: {
    type: 'info',
  },
}

export const Warn: Story = {
  args: {
    type: 'warn',
  },
}
