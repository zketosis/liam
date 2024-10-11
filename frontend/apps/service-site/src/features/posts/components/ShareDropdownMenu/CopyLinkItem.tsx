import type { TranslationFn } from '@/features/i18n'
import {
  DropdownMenuItem,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@packages/ui'
import { CopyIcon } from 'lucide-react'
import { type FC, useCallback, useEffect, useState } from 'react'
import styles from './ShareDropdownMenu.module.css'

type Props = {
  t: TranslationFn
  onOpenChange: (open: boolean) => void
}

export const CopyLinkItem: FC<Props> = ({ t, onOpenChange }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!show) return

    const timer = setTimeout(() => {
      setShow(false)
      onOpenChange(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [show, onOpenChange])

  const handleCopyLink = useCallback(async (event: Event) => {
    event.preventDefault()
    const url = encodeURIComponent(window.location.href)
    navigator.clipboard.writeText(url).then(() => {
      setShow(true)
    })
  }, [])

  return (
    <TooltipProvider>
      <TooltipRoot open={show}>
        <TooltipTrigger asChild>
          <DropdownMenuItem
            leftIcon={<CopyIcon className={styles.icon} />}
            onSelect={handleCopyLink}
          >
            <span>{t('posts.share.copyLink')}</span>
          </DropdownMenuItem>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent sideOffset={5}>Link Copied</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
