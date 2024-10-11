import { type Lang, getTranslation } from '@/features/i18n'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  FacebookIcon,
  LinkedInIcon,
  XIcon,
} from '@packages/ui'
import { type FC, type PropsWithChildren, useState } from 'react'
import { CopyLinkItem } from './CopyLinkItem'
import styles from './ShareDropdownMenu.module.css'

type Props = PropsWithChildren<{
  lang: Lang
}>

export const ShareDropdownMenu: FC<Props> = ({ children, lang }) => {
  const [open, setOpen] = useState(false)
  const { t } = getTranslation(lang)

  return (
    <DropdownMenuRoot open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={5} align="start">
          <CopyLinkItem t={t} onOpenChange={setOpen} />
          <DropdownMenuItem
            leftIcon={<XIcon className={styles.icon} />}
            onSelect={() => alert('Item 2 clicked')}
          >
            <span>{t('posts.share.x')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            leftIcon={<FacebookIcon className={styles.icon} />}
            onSelect={() => alert('Item 3 clicked')}
          >
            <span>{t('posts.share.facebook')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            leftIcon={<LinkedInIcon className={styles.icon} />}
            onSelect={() => alert('Item 3 clicked')}
          >
            <span>{t('posts.share.linkedin')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  )
}
