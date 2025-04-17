import { userEditingStore } from '@/stores/userEditing/store'
import { Group, IconButton } from '@liam-hq/ui'
import { ToolbarToggleGroup, ToolbarToggleItem } from '@radix-ui/react-toolbar'
import { type ComponentProps, type FC, useCallback } from 'react'
import { useSnapshot } from 'valtio'
import styles from './GroupButton.module.css'

const GROUP_VALUE = 'group'

interface GroupButtonProps {
  size?: ComponentProps<typeof IconButton>['size']
}

export const GroupButton: FC<GroupButtonProps> = ({ size = 'md' }) => {
  const { isTableGroupEditMode } = useSnapshot(userEditingStore)

  const handleChangeValue = useCallback((value: string) => {
    userEditingStore.isTableGroupEditMode = value === GROUP_VALUE
  }, [])

  return (
    <ToolbarToggleGroup
      type="single"
      onValueChange={handleChangeValue}
      value={isTableGroupEditMode ? GROUP_VALUE : ''}
    >
      <ToolbarToggleItem
        value={GROUP_VALUE}
        asChild
        className={styles.menuButton}
      >
        <IconButton
          icon={<Group />}
          size={size}
          tooltipContent="Edit table groups"
          aria-label="Edit table groups"
        />
      </ToolbarToggleItem>
    </ToolbarToggleGroup>
  )
}
