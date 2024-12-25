import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@liam-hq/db-structure', '@liam-hq/erd-core'],
}

export default nextConfig
