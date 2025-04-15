/**
 * NOTE: This is an example test file for the AppBar component.
 * To run these tests, you would need to install the following dependencies:
 * - @testing-library/react
 * - @testing-library/jest-dom
 * - @types/jest
 *
 * The errors shown in this file are expected since these dependencies
 * might not be installed in the current project.
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { AppBar } from './AppBar'

describe('AppBar', () => {
  const defaultProps = {
    projectName: 'test-project',
    branchName: 'main',
    avatarInitial: 'T',
  }

  it('renders correctly with default props', () => {
    render(<AppBar {...defaultProps} />)

    expect(screen.getByText('test-project')).toBeInTheDocument()
    expect(screen.getByText('main')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('renders branch tag when provided', () => {
    render(<AppBar {...defaultProps} branchTag="production" />)

    expect(screen.getByText('production')).toBeInTheDocument()
  })

  it('calls onProjectClick when project is clicked', () => {
    const onProjectClick = jest.fn()
    render(<AppBar {...defaultProps} onProjectClick={onProjectClick} />)

    fireEvent.click(screen.getByText('test-project'))
    expect(onProjectClick).toHaveBeenCalledTimes(1)
  })

  it('calls onBranchClick when branch is clicked', () => {
    const onBranchClick = jest.fn()
    render(<AppBar {...defaultProps} onBranchClick={onBranchClick} />)

    fireEvent.click(screen.getByText('main'))
    expect(onBranchClick).toHaveBeenCalledTimes(1)
  })

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = jest.fn()
    render(<AppBar {...defaultProps} onSearchChange={onSearchChange} />)

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'test search' },
    })
    expect(onSearchChange).toHaveBeenCalledWith('test search')
  })

  it('calls onNotificationClick when notification button is clicked', () => {
    const onNotificationClick = jest.fn()
    render(
      <AppBar {...defaultProps} onNotificationClick={onNotificationClick} />,
    )

    fireEvent.click(screen.getByLabelText('Notifications'))
    expect(onNotificationClick).toHaveBeenCalledTimes(1)
  })

  it('calls onAvatarClick when avatar is clicked', () => {
    const onAvatarClick = jest.fn()
    render(<AppBar {...defaultProps} onAvatarClick={onAvatarClick} />)

    fireEvent.click(screen.getByLabelText('User profile'))
    expect(onAvatarClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom avatar color when provided', () => {
    render(<AppBar {...defaultProps} avatarColor="rgb(0, 191, 207)" />)

    const avatar = screen.getByLabelText('User profile')
    expect(avatar).toHaveStyle('background-color: rgb(0, 191, 207)')
  })
})
