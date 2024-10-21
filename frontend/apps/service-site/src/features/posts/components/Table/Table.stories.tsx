import type { Meta, StoryObj } from '@storybook/react'

import { Table } from '.'

const StoryComponent = () => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>25</td>
          <td>Male</td>
        </tr>
        <tr>
          <td>Jane Doe</td>
          <td>24</td>
          <td>Female</td>
        </tr>
        <tr>
          <td>John Doe</td>
          <td>25</td>
          <td>Male</td>
        </tr>
        <tr>
          <td>Jane Doe</td>
          <td>24</td>
          <td>Female</td>
        </tr>
        <tr>
          <td>John Doe</td>
          <td>25</td>
          <td>Male</td>
        </tr>
        <tr>
          <td>Jane Doe</td>
          <td>24</td>
          <td>Female</td>
        </tr>
      </tbody>
    </Table>
  )
}

const meta = {
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
