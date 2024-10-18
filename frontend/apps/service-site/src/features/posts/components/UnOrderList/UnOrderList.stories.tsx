import type { Meta, StoryObj } from '@storybook/react'

import { UnOrderList } from '.'

const StoryComponent = () => {
  return (
    <UnOrderList>
      <li>
        The importance of no-code platforms cannot be overstated. They are
        breaking down barriers to entry, enabling individuals and businesses of
        all sizes to innovate and solve problems with custom software solutions.
        Here’s why the no-code revolution is so significant
      </li>
      <li>
        The importance of no-code platforms cannot be overstated. They are
        breaking down barriers to entry, enabling individuals and businesses of
        all sizes to innovate and solve problems with custom software solutions.
        Here’s why the no-code revolution is so significant
      </li>
      <li>
        The importance of no-code platforms cannot be overstated. They are
        breaking down barriers to entry, enabling individuals and businesses of
        all sizes to innovate and solve problems with custom software solutions.
        Here’s why the no-code revolution is so significant
      </li>
      <li>
        The importance of no-code platforms cannot be overstated. They are
        breaking down barriers to entry, enabling individuals and businesses of
        all sizes to innovate and solve problems with custom software solutions.
        Here’s why the no-code revolution is so significant
      </li>
    </UnOrderList>
  )
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
