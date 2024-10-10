/* eslint-disable react/jsx-no-bind */
import type { Meta, StoryObj } from '@storybook/react'
import { PlusIcon } from 'lucide-react'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'

const StoryComponent = () => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <button type="button">Open Menu</button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={5} align="start">
          <DropdownMenuItem onSelect={() => alert('Item 1 clicked')}>
            <span>Item 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert('Item 2 clicked')}>
            <span>Item 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            leftIcon={<PlusIcon />}
            onSelect={() => alert('Item 3 clicked')}
          >
            <span>Item 3</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            size="sm"
            onSelect={() => alert('sm Item 1 clicked')}
          >
            <span>sm Item 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            size="sm"
            leftIcon={<PlusIcon />}
            onSelect={() => alert('sm Item 2 clicked')}
          >
            <span>sm Item 2</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  )
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
