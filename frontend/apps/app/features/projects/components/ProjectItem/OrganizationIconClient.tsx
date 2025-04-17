'use client'

import Image from 'next/image'
import { ProjectIcon } from './ProjectIcon'
import styles from './ProjectItem.module.css'

interface OrganizationIconClientProps {
  avatarUrl?: string
  owner: string
}

export function OrganizationIconClient({
  avatarUrl,
  owner,
}: OrganizationIconClientProps) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${owner} organization icon`}
        width={32}
        height={32}
        className={styles.icon}
      />
    )
  }

  return <ProjectIcon className={styles.icon} />
}
