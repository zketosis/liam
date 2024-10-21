import type { Meta, StoryObj } from '@storybook/react'

import { Image } from '.'

const StoryComponent = () => {
  return (
    <Image
      src="/images/posts/2/image.png"
      alt="Empowering the next generation of creators through no-code solutions."
    />
  )
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
