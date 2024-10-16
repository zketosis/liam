import path from 'node:path'
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  framework: '@storybook/nextjs',
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    {
      directory: path.resolve(__dirname, '../../../packages/ui/src'),
      titlePrefix: 'UI',
    },
  ],
  features: {
    experimentalRSC: true,
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        'contentlayer/generated': path.resolve(
          __dirname,
          '../.contentlayer/generated',
        ),
      }
    }
    return config
  },
  staticDirs: ['../public'],
}

export default config
