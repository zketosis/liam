import { useCliVersion } from '@/providers'
import type { FC } from 'react'
import styles from './ReleaseVersion.module.css'

export const ReleaseVersion: FC = () => {
  const { cliVersion } = useCliVersion()

  // Example output for cliVersion:
  // - Released version:
  //   v0.0.11 (2024-12-19)
  // - Unreleased version:
  //   v0.0.11 + 0d6169a (2024-12-19)
  //
  // Explanation:
  // - "Released version" means the current Git hash matches a tagged release.
  // - "Unreleased version" includes a short Git hash prefix to indicate changes since the last release.
  return (
    <div className={styles.cliVersion}>
      <span>{`v${cliVersion.version}`}</span>
      <span>
        {' '}
        {cliVersion.isReleasedGitHash || `+ ${cliVersion.gitHash.slice(0, 7)} `}
      </span>
      <span>{cliVersion.date.length > 0 && ` (${cliVersion.date})`}</span>
    </div>
  )
}
