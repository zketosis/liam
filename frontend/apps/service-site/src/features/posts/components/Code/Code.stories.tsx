import type { Meta, StoryObj } from '@storybook/react'

import { Code } from '.'

const StoryComponent = () => {
  return <Code>No-code</Code>
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
