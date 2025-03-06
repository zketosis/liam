import { Menu, XIcon, useSidebar } from '@liam-hq/ui'
import { forwardRef, useCallback } from 'react'
import styles from './MenuButton.module.css'

export const MenuButton = forwardRef<HTMLButtonElement>((_, ref) => {
  const { open, toggleSidebar } = useSidebar()

  const handleClick = useCallback(() => {
    toggleSidebar()
  }, [toggleSidebar])

  return (
    <button
      ref={ref}
      type="button"
      className={styles.wrapper}
      onClick={handleClick}
    >
      {open ? (
        <XIcon className={styles.icon} />
      ) : (
        <Menu className={styles.icon} />
      )}
    </button>
  )
})
MenuButton.displayName = 'MenuButton'
