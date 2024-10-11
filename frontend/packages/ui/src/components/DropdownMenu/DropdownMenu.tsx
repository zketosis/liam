import {
  Content,
  Item,
  ItemIndicator,
  Label,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import { type ComponentProps, type ReactNode, forwardRef } from 'react'
import { match } from 'ts-pattern'
import styles from './DropdownMenu.module.css'

export const DropdownMenuRoot = Root
export const DropdownMenuTrigger = Trigger
export const DropdownMenuPortal = Portal
export const DropdownMenuRadioGroup = RadioGroup
export const DropdownMenuItemIndicator = ItemIndicator
export const DropdownMenuLabel = Label
export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof Content>
>(({ className, ...props }, ref) => {
  return (
    <Content {...props} ref={ref} className={clsx(className, styles.content)} />
  )
})

DropdownMenuContent.displayName = 'DropdownMenuContent'

type DropdownMenuItemProps = ComponentProps<typeof Item> & {
  variant?: 'default' | 'danger'
  size?: 'sm' | 'md'
  leftIcon?: ReactNode
}
export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(
  (
    {
      variant = 'default',
      size = 'md',
      leftIcon,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeClassName = match(size)
      .with('sm', () => styles.sm)
      .with('md', () => styles.md)
      .exhaustive()

    const variantClassName = match(variant)
      .with('default', () => styles.default)
      .with('danger', () => styles.danger)
      .exhaustive()

    return (
      <Item
        {...props}
        ref={ref}
        className={clsx(
          styles.item,
          sizeClassName,
          variantClassName,
          className,
        )}
      >
        {leftIcon && (
          <span className={clsx(styles.icon, styles.leftIcon)}>{leftIcon}</span>
        )}
        <div>{children}</div>
      </Item>
    )
  },
)

DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof RadioItem>
>(({ className, ...props }, ref) => {
  return (
    <RadioItem {...props} ref={ref} className={clsx(className, styles.item)} />
  )
})

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

export const DropdownMenuSeparator = () => {
  return <Separator className={styles.separator} />
}
