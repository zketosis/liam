import clsx from 'clsx'
import styles from './ShareIconButton.module.css'
import { Share } from '../Icons'

export const ShareIconButton = () => {
  return (
    <button
      className={clsx(styles.button)}
    >
      <Share className={clsx(styles.icon)}/>
      {/* Add tooltip component after import packages/ui/src/components */}
    </button>
  )
}
