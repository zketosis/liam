import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/components'
import { ChevronsUpDown } from '@/icons'
import type { FC } from 'react'
import styles from './BranchDropdownMenu.module.css'
import { type Branch, getBranches } from './services/getBranches'

type Props = {
  currentProjectId: string
  currentBranchOrCommit: string
}

export const BranchDropdownMenu: FC<Props> = async ({
  currentProjectId,
  currentBranchOrCommit,
}) => {
  const branches = await getBranches(currentProjectId)
  const currentBranch = branches.find(
    (branch) => branch.name === currentBranchOrCommit,
  )

  if (currentBranch == null) {
    return null
  }

  return (
    <DropdownMenuRoot>
      <Trigger currentBranch={currentBranch} />
      <Content currentBranch={currentBranch} branches={branches} />
    </DropdownMenuRoot>
  )
}

type TriggerProps = {
  currentBranch: Branch
}

const Trigger: FC<TriggerProps> = ({ currentBranch }) => {
  return (
    <DropdownMenuTrigger className={styles.trigger}>
      <div className={styles.nameAndTag}>
        <span className={styles.name}>{currentBranch.name}</span>
        {currentBranch.protected && (
          <span className={styles.tag}>production</span>
        )}
      </div>
      <ChevronsUpDown className={styles.chevronIcon} />
    </DropdownMenuTrigger>
  )
}

type ContentProps = {
  currentBranch: Branch
  branches: Branch[]
}

const Content: FC<ContentProps> = ({ currentBranch, branches }) => {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContent align="start" className={styles.content}>
        <DropdownMenuRadioGroup value={currentBranch.name}>
          {branches
            .sort((a, b) => {
              // If a is selected, it comes first
              if (a.name === currentBranch.name) return -1
              // If b is selected, it comes first
              if (b.name === currentBranch.name) return 1
              // Otherwise, maintain original order
              return 0
            })
            .map(({ name }) => (
              <DropdownMenuRadioItem
                key={name}
                value={name}
                label={name}
                className={styles.radioItem}
              />
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  )
}
