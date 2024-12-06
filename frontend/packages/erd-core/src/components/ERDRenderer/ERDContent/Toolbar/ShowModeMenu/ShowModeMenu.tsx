import {
  Button,
  ChevronDown,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@liam-hq/ui'
import { type FC, useCallback, useState } from 'react'
import { type InferOutput, picklist, safeParse } from 'valibot'
import styles from './ShowModeMenu.module.css'

const showModeSchema = picklist(['ALL_FIELDS', 'TABLE_NAME', 'KEY_ONLY'])
type ShowMode = InferOutput<typeof showModeSchema>

const OPTION_LIST: { value: ShowMode; label: string }[] = [
  { value: 'ALL_FIELDS', label: 'All Fields' },
  { value: 'TABLE_NAME', label: 'Table Name' },
  { value: 'KEY_ONLY', label: 'Key Only' },
]

export const ShowModeMenu: FC = () => {
  const [showMode, setShowMode] = useState<ShowMode>('ALL_FIELDS')

  const handleChangeValue = useCallback((value: string) => {
    const parsed = safeParse(showModeSchema, value)

    if (parsed.success) {
      setShowMode(parsed.output)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>show</span>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Button
            size="sm"
            variant="ghost-secondary"
            rightIcon={<ChevronDown />}
          >
            {OPTION_LIST.find((opt) => opt.value === showMode)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className={styles.content}
            align="start"
            side="bottom"
            sideOffset={12}
          >
            <DropdownMenuRadioGroup
              value={showMode}
              onValueChange={handleChangeValue}
            >
              {OPTION_LIST.map(({ value, label }) => (
                <DropdownMenuRadioItem
                  key={value}
                  value={value}
                  label={label}
                />
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>
  )
}
