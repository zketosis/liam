// biome-ignore lint/correctness/noNodejsModules: This code is only run in the Node.js environment.
import { execSync } from 'node:child_process'
import type { NextConfig } from 'next'

const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim()
const releaseDate = new Date().toISOString().split('T')[0]

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_HASH: gitCommitHash,
    NEXT_PUBLIC_RELEASE_DATE: releaseDate,
  },
}

export default nextConfig
