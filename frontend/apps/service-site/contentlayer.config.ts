import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*.md',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: {
      type: 'list',
      of: {
        type: 'string',
      },
      required: true,
    },
    categories: {
      type: 'list',
      of: {
        type: 'string',
      },
      required: true,
    },
    writer: { type: 'string', required: true },
    image: { type: 'string', required: true },
    introduction: { type: 'string', required: true },
  },
  computedFields: {
    href: { type: 'string', resolve: (post) => `/${post._raw.flattenedPath}` },
    slug: {
      type: 'string',
      resolve: (post) => {
        const segments = post._raw.flattenedPath.split('/')
        return segments[segments.length - 1]
      },
    },
  },
}))

export default makeSource({ contentDirPath: 'contents', documentTypes: [Post] })
