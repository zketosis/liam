import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

function isProductionEnvironment() {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'liam-docs-sigma.vercel.app'
  }
  return false
}
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  assetPrefix: isProductionEnvironment()
    ? 'https://liam-docs-sigma.vercel.app'
    : '',
}

export default withMDX(config)
