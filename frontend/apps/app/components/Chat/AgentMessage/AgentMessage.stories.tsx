import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { AgentMessage } from './AgentMessage'

// Define the component props type
type AgentMessageProps = ComponentProps<typeof AgentMessage>

const meta = {
  component: AgentMessage,
  title: 'Components/Chat/AgentMessage',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentMessage>

export default meta
type Story = StoryObj<AgentMessageProps>

export const BuildDefault: Story = {
  args: {
    agent: 'build',
    state: 'default',
    message:
      'We would like to make a proposal for the implementation of a chat UI. First, please allow me to check the current structure of the schema page.',
    time: '12:10',
  },
}

export const AskDefault: Story = {
  args: {
    agent: 'ask',
    state: 'default',
    message:
      'We would like to make a proposal for the implementation of a chat UI. First, please allow me to check the current structure of the schema page.',
    time: '12:10',
  },
}

export const BuildGenerating: Story = {
  args: {
    agent: 'build',
    state: 'generating',
  },
}

export const AskGenerating: Story = {
  args: {
    agent: 'ask',
    state: 'generating',
  },
}
