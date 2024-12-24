import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  assetPrefix: process.env.ASSET_PREFIX || '',
}

export default withMDX(config)
