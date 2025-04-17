import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@liam-hq/ui'
import { Check, GitBranch, Plus } from '@liam-hq/ui/src/icons'
import type { ComponentProps } from 'react'
import styles from './BranchesDropdown.module.css'

export interface BranchItem {
  id: string
  name: string
  tag?: string
}

export interface BranchesDropdownProps extends ComponentProps<'div'> {
  branches: BranchItem[]
  selectedBranchId?: string | undefined
  onBranchSelect: (branch: BranchItem) => void
  onAddNewBranch?: () => void
}

export const BranchesDropdown = ({
  branches,
  selectedBranchId,
  onBranchSelect,
  onAddNewBranch,
  ...props
}: BranchesDropdownProps) => {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContent
        className={styles.dropdownContainer}
        sideOffset={5}
        align="start"
        {...props}
      >
        <div className={styles.branchesList}>
          {/* Sort branches to put the selected branch at the top */}
          {branches
            .slice()
            .sort((a, b) => {
              // If a is selected, it comes first
              if (a.id === selectedBranchId) return -1
              // If b is selected, it comes first
              if (b.id === selectedBranchId) return 1
              // Otherwise, maintain original order
              return 0
            })
            .map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                className={styles.branchItem}
                onClick={() => onBranchSelect(branch)}
              >
                <GitBranch
                  width={16}
                  height={16}
                  color="rgba(255, 255, 255, 0.2)"
                />
                <div className={styles.branchContent}>
                  <span
                    className={
                      branch.tag === 'production'
                        ? styles.branchNameWithBadge
                        : styles.branchName
                    }
                  >
                    {branch.name}
                  </span>
                  {branch.tag === 'production' && (
                    <span className={styles.branchTag}>{branch.tag}</span>
                  )}
                </div>
                {branch.id === selectedBranchId && (
                  <span className={styles.checkContainer}>
                    <Check width={10} height={10} color="#1DED83" />
                  </span>
                )}
              </DropdownMenuItem>
            ))}
        </div>

        {onAddNewBranch && (
          <button
            className={styles.addNewBranch}
            onClick={onAddNewBranch}
            aria-label="Add new branch"
            type="button"
          >
            <Plus width={16} height={16} color="rgba(255, 255, 255, 0.5)" />
            <span className={styles.addNewBranchText}>Add new branch</span>
          </button>
        )}
      </DropdownMenuContent>
    </DropdownMenuPortal>
  )
}
