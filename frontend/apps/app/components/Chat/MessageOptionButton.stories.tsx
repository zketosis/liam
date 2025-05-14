import type { Meta } from '@storybook/react'
import { MessageOptionButton } from './MessageOptionButton'
import type { MessageOptionButtonProps } from './MessageOptionButton'
import { MessageOptionButtons } from './MessageOptionButtons'

// Define the meta for the component
const meta: Meta<MessageOptionButtonProps> = {
  title: 'Components/Chat/MessageOptionButton',
  component: MessageOptionButton,
}

export default meta

// Individual MessageOptionButton examples
export const BuildDefault = () => (
  <MessageOptionButton
    text="Options for interacting with LLM during database design."
    agentType="build"
    isSelected={false}
    isDisabled={false}
  />
)

export const BuildSelected = () => (
  <MessageOptionButton
    text="Options for interacting with LLM during database design."
    agentType="build"
    isSelected={true}
    isDisabled={false}
  />
)

export const BuildDisabled = () => (
  <MessageOptionButton
    text="Options for interacting with LLM during database design."
    agentType="build"
    isSelected={false}
    isDisabled={true}
  />
)

export const AskDefault = () => (
  <MessageOptionButton
    text="Options for interacting with LLM during database design."
    agentType="ask"
    isSelected={false}
    isDisabled={false}
  />
)

export const AskSelected = () => (
  <MessageOptionButton
    text="Options for interacting with LLM during database design."
    agentType="ask"
    isSelected={true}
    isDisabled={false}
  />
)

export const AskDisabled = () => (
  <MessageOptionButton
    text="Options for interacting with LLM during database design."
    agentType="ask"
    isSelected={false}
    isDisabled={true}
  />
)

// MessageOptionButtons examples
export const OptionButtonsGroup = () => (
  <div style={{ width: '400px' }}>
    <MessageOptionButtons
      options={[
        { id: '1', text: 'Option 1: Create a new table' },
        { id: '2', text: 'Option 2: Modify existing schema' },
        { id: '3', text: 'Option 3: Generate SQL queries' },
      ]}
      agentType="build"
    />
  </div>
)
OptionButtonsGroup.storyName = 'MessageOptionButtons - Build'

export const OptionButtonsGroupAsk = () => (
  <div style={{ width: '400px' }}>
    <MessageOptionButtons
      options={[
        { id: '1', text: 'Option 1: Explain database normalization' },
        { id: '2', text: 'Option 2: Suggest performance improvements' },
        {
          id: '3',
          text: 'Option 3: Analyze query complexity',
        },
      ]}
      agentType="ask"
    />
  </div>
)
OptionButtonsGroupAsk.storyName = 'MessageOptionButtons - Ask'
