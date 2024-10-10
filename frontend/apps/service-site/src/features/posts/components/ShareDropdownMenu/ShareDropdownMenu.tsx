import type { TranslationFn } from '@/features/i18n'
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
import { CopyIcon } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import styles from './ShareDropdownMenu.module.css'

type Props = PropsWithChildren<{
  t: TranslationFn
}>

export const ShareDropdownMenu: FC<Props> = ({ children, t }) => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={5} align="start">
          <DropdownMenuItem
            leftIcon={<CopyIcon className={styles.icon} />}
            onSelect={() => alert('Item 1 clicked')}
          >
            <span>{t('posts.share.copyLink')}</span>
          </DropdownMenuItem>
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
