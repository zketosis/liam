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

const handleSelect = (url: string) => () => {
  window.open(url, '_blank', 'noreferrer')
}

export const ShareDropdownMenu: FC<Props> = ({ children, lang }) => {
  const [open, setOpen] = useState(false)
  const { t } = getTranslation(lang)
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(document.title)

  return (
    <DropdownMenuRoot open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={5} align="start">
          <CopyLinkItem t={t} onOpenChange={setOpen} />
          <DropdownMenuItem
            leftIcon={<XIcon className={styles.icon} />}
            onSelect={handleSelect(
              `http://twitter.com/share?url=${url}&text=${title}`,
            )}
          >
            <span>{t('posts.share.x')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            leftIcon={<FacebookIcon className={styles.icon} />}
            onSelect={handleSelect(
              `http://www.facebook.com/share.php?u=${url}`,
            )}
          >
            <span>{t('posts.share.facebook')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            leftIcon={<LinkedInIcon className={styles.icon} />}
            onSelect={handleSelect(
              `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            )}
          >
            <span>{t('posts.share.linkedin')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  )
}
