import type { Meta, StoryObj } from '@storybook/react'

import { CodeBlock } from '.'

const StoryComponent = () => {
  return <CodeBlock>No-code</CodeBlock>
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
