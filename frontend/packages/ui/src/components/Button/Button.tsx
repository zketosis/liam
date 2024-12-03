import clsx from 'clsx'
import { type ComponentProps, type ReactNode, forwardRef } from 'react'
import { match } from 'ts-pattern'
import styles from './Button.module.css'

type Props = ComponentProps<'button'> & {
  variant?: 'solid-primary' | 'solid-danger' | 'outline-secondary'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant = 'solid-primary',
      size = 'sm',
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variantClassName = match(variant)
      .with('solid-primary', () => styles.solidPrimary)
      .with('solid-danger', () => styles.solidDanger)
      .with('outline-secondary', () => styles.outlineSecondary)
      .exhaustive()

    const sizeClassName = match(size)
      .with('sm', () => styles.sm)
      .with('md', () => styles.md)
      .with('lg', () => styles.lg)
      .exhaustive()

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          styles.wrapper,
          sizeClassName,
          className,
          !disabled && variantClassName,
          disabled && styles.disabled,
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
        {children}
        {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
      </button>
    )
  },
)

Button.displayName = 'Button'
