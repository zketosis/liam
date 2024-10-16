import type { Meta, StoryObj } from '@storybook/react'

import { PostWriter } from './PostWriter'

export interface MDX {
  type: string
  code: string
  content: string
  raw: string
  html: string
}

const meta = {
  component: PostWriter,
} satisfies Meta<typeof PostWriter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    post: {
      title:
        '1 The No-Code Revolution: A New Era Where Non-Programmers Can Build Apps',
      tags: [
        'Democratization',
        'Empowerment',
        'Innovation',
        'Agility',
        'Disruption',
      ],
      writer: 'Aiden Sparks',
      introduction:
        'The rise of no-code application platforms is changing the landscape of software development. These platforms allow users with little to no coding knowledge to create fully functional applications, reducing the barrier to entry for innovation. The convenience, flexibility, and speed offered by no-code tools are helping businesses of all sizes innovate at unprecedented rates.',
      image: '/images/posts/1/image.png',
      _id: '1',
      date: new Date().toISOString(),
      categories: ['Technology', 'Business'],
      body: {
        type: 'mdx',
        code: '# Markdown contents',
        content: 'Markdown contents',
        raw: '# Markdown contents',
        html: '<h1>Markdown contents</h1>',
      } as MDX,
      lang: 'en',
      slug: 'dummy-1',
      _raw: {
        sourceFilePath: 'path/to/file',
        sourceFileName: 'fileName',
        sourceFileDir: 'path/to/dir',
        contentType: 'mdx',
        flattenedPath: 'flattened/path',
      },
      type: 'Post',
      writerProfile:
        'Technology writer and digital strategy consultant. Author of "Beyond the Code: Building the Future." Originally from the United States, Aiden specializes in no-code development and digital transformation. Currently focused on exploring the latest trends in AI and automation while continuing his writing endeavors.',
      lastEditedOn: new Date().toISOString(),
    },
  },
}
