import type { Meta, StoryObj } from '@storybook/react'

import { Coffee } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from './'

const meta = {
  component: Button,
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(args) {
    return <Overview {...args} />
  },
}

const Td = (props: ComponentProps<'td'>) => (
  <td
    style={{
      padding: '1rem',
      textAlign: 'center',
      verticalAlign: 'middle',
      border: '1px dashed var(--button-primary-foreground)',
    }}
    {...props}
  />
)

const Overview = (args: Story['args']) => (
  <table>
    <tbody>
      <tr>
        <Td />
        <Td />
        <Td colSpan={3}>show leftIcon: true</Td>
        <Td colSpan={3}>show leftIcon: false</Td>
      </tr>
      <tr>
        <Td />
        <Td />
        <Td>sm</Td>
        <Td>md</Td>
        <Td>lg</Td>
        <Td>sm</Td>
        <Td>md</Td>
        <Td>lg</Td>
      </tr>
      <tr>
        <Td rowSpan={2}>solid-primary</Td>
        <Td>default</Td>
        <Td>
          <Button
            size="sm"
            variant="solid-primary"
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="md"
            variant="solid-primary"
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="lg"
            variant="solid-primary"
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button size="sm" variant="solid-primary" {...args} />
        </Td>
        <Td>
          <Button size="md" variant="solid-primary" {...args} />
        </Td>
        <Td>
          <Button size="lg" variant="solid-primary" {...args} />
        </Td>
      </tr>
      <tr>
        <Td>disabled</Td>
        <Td>
          <Button
            size="sm"
            variant="solid-primary"
            disabled
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="md"
            variant="solid-primary"
            disabled
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="lg"
            variant="solid-primary"
            disabled
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button size="sm" variant="solid-primary" disabled {...args} />
        </Td>
        <Td>
          <Button size="md" variant="solid-primary" disabled {...args} />
        </Td>
        <Td>
          <Button size="lg" variant="solid-primary" disabled {...args} />
        </Td>
      </tr>
      <tr>
        <Td rowSpan={2}>solid-danger</Td>
        <Td>default</Td>
        <Td>
          <Button
            size="sm"
            variant="solid-danger"
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="md"
            variant="solid-danger"
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="lg"
            variant="solid-danger"
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button size="sm" variant="solid-danger" {...args} />
        </Td>
        <Td>
          <Button size="md" variant="solid-danger" {...args} />
        </Td>
        <Td>
          <Button size="lg" variant="solid-danger" {...args} />
        </Td>
      </tr>
      <tr>
        <Td>disabled</Td>
        <Td>
          <Button
            size="sm"
            variant="solid-danger"
            disabled
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="md"
            variant="solid-danger"
            disabled
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button
            size="lg"
            variant="solid-danger"
            disabled
            leftIcon={<Coffee style={{ width: '100%', height: '100%' }} />}
            {...args}
          />
        </Td>
        <Td>
          <Button size="sm" variant="solid-danger" disabled {...args} />
        </Td>
        <Td>
          <Button size="md" variant="solid-danger" disabled {...args} />
        </Td>
        <Td>
          <Button size="lg" variant="solid-danger" disabled {...args} />
        </Td>
      </tr>
    </tbody>
  </table>
)
