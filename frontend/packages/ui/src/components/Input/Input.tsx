import clsx from 'clsx'
import { type ComponentProps, type ReactNode, forwardRef } from 'react'
import { match } from 'ts-pattern'
import styles from './Input.module.css'

type Props = Omit<ComponentProps<'input'>, 'size'> & {
  align?: 'left' | 'right'
  size?: 'md' | 'sm' | 'xs'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  wrapperClassName?: string
  error?: boolean | undefined
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    type = 'text',
    align = 'left',
    size = 'md',
    className,
    wrapperClassName,
    leftIcon,
    rightIcon,
    disabled,
    readOnly,
    error,
    ...rest
  },
  ref,
) {
  size
  const sizeClassName = match(size)
    .with('md', () => styles.md)
    .with('sm', () => styles.sm)
    .with('xs', () => styles.xs)
    .exhaustive()

  return (
    <div
      className={clsx(styles.wrapper, wrapperClassName, sizeClassName, {
        [styles.readOnly]: readOnly,
        [styles.disabled]: disabled,
        [styles.error]: error,
      })}
    >
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      <input
        {...rest}
        type={type}
        ref={ref}
        className={clsx(styles.input, className, {
          [styles.alignRight]: align === 'right',
        })}
        disabled={disabled}
        readOnly={readOnly}
      />
      {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
    </div>
  )
})
