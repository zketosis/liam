import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import React, { type PropsWithChildren, type ComponentProps } from 'react'
import styles from './Modal.module.css'

export const ModalRoot = Dialog.Root

export const ModalTrigger = Dialog.Trigger

export const ModalPortal = Dialog.Portal

export const ModalOverlay = React.forwardRef<HTMLDivElement>((props, ref) => (
  <Dialog.Overlay ref={ref} className={styles.dialogOverlay} {...props} />
))
ModalOverlay.displayName = 'ModalOverlay'

export const ModalContent = React.forwardRef<
  HTMLDivElement,
  ComponentProps<typeof Dialog.Content>
>(({ className, ...props }, ref) => (
  <Dialog.Content
    ref={ref}
    className={clsx(styles.dialogContent, className)}
    {...props}
    role="dialog"
  />
))
ModalContent.displayName = 'ModalContent'

export const ModalTitle: React.FC<ComponentProps<typeof Dialog.Title>> = ({
  className,
  children,
  ...props
}) => (
  <Dialog.Title className={clsx(styles.dialogTitle, className)} {...props}>
    {children}
  </Dialog.Title>
)

export const ModalDescription: React.FC<
  ComponentProps<typeof Dialog.Description>
> = ({ children, ...props }) => (
  <Dialog.Description className={styles.dialogDescription} {...props}>
    {children}
  </Dialog.Description>
)

type ModalActionsProps = PropsWithChildren & {
  className?: string
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  children,
  className,
}) => {
  return <div className={clsx(styles.dialogActions, className)}>{children}</div>
}

export const ModalClose: React.FC<ComponentProps<typeof Dialog.Close>> = ({
  children,
  ...props
}) => {
  return (
    <Dialog.Close className={styles.dialogButton} {...props}>
      {children}
    </Dialog.Close>
  )
}

export const ModalConfirm: React.FC<ComponentProps<'button'>> = (props) => {
  return <button type="button" className={styles.confirmButton} {...props} />
}
