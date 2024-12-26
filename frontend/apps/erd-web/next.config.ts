import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/erd/p/\\[\\.\\.\\.slug\\]': ['./prism.wasm'],
  },
}

export default nextConfig
