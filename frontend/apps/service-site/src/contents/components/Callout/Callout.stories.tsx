import type { Meta, StoryObj } from '@storybook/react'

import { Callout } from './'

const StoryComponent = () => {
  return (
    <Callout>
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
