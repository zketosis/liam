import {
  LiamLogoMark,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './AppBar.module.css'
import { CopyLinkButton } from './CopyLinkButton'
import { ExportButton } from './ExportButton'
import { GithubButton } from './GithubButton'
import { HelpButton } from './HelpButton'
import { ReleaseNoteButton } from './ReleaseNoteButton'

export const AppBar: FC = () => {
  return (
    <header className={styles.wrapper}>
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <a href="https://liambx.com" target="_blank" rel="noreferrer">
              <LiamLogoMark className={styles.logo} />
            </a>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent sideOffset={4}>Go to Home page</TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>

      <h1 className={styles.title}>Liam ERD</h1>

      <div className={styles.rightSide}>
        <div className={styles.iconButtonGroup}>
          <GithubButton />
          <ReleaseNoteButton />
          <HelpButton />
        </div>
        <ExportButton />
        <CopyLinkButton />
      </div>
    </header>
  )
}
