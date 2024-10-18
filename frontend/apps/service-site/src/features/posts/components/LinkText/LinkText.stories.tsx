import type { Meta, StoryObj } from '@storybook/react'

import { LinkText } from '.'

const StoryComponent = () => {
  return <LinkText href="https://www.google.com">dummy</LinkText>
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
