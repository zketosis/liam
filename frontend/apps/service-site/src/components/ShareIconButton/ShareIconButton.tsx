import clsx from 'clsx'
import { Share } from '../Icons'
import styles from './ShareIconButton.module.css'

export const ShareIconButton = () => {
  return (
    <div className={clsx(styles.button)}>
      <Share className={clsx(styles.icon)} />
      {/* Add tooltip component after import packages/ui/src/components */}
    </div>
  )
}
