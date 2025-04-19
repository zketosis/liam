'use client'

import {
  Avatar,
  Ellipsis,
  IconButton,
  getAvatarUserFromColor,
} from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './MemberItem.module.css'

interface MemberItemProps {
  name: string
  email: string
  initial: string
  avatarColor?: number
  onMoreOptions?: () => void
}

export const MemberItem: FC<MemberItemProps> = ({
  name,
  email,
  initial,
  avatarColor = 1,
  onMoreOptions,
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
            <span className={styles.name}>{name}</span>
            <span className={styles.email}>{email}</span>
          </div>
          <div className={styles.spacer} />
          <div className={styles.moreButton}>
            <IconButton
              icon={<Ellipsis />}
              tooltipContent="More options"
              onClick={onMoreOptions}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
