import { Avatar, getAvatarUserFromColor } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './MemberItem.module.css'

interface InvitationItemProps {
  email: string
  initial: string
  avatarColor: number
}

export const InvitationItem: FC<InvitationItemProps> = ({
  email,
  initial,
  avatarColor,
}) => {
  return (
    <div className={styles.memberItem}>
      <Avatar
        initial={initial}
        size="lg"
        user={getAvatarUserFromColor(avatarColor)}
      />
      <div className={styles.memberBody}>
        <div className={styles.memberInfo}>
          <div className={styles.nameEmail}>
            <span className={styles.name}>{email.split('@')[0]}</span>
            <span className={styles.email}>{email}</span>
          </div>
          <div className={styles.spacer} />
        </div>
      </div>
    </div>
  )
}
