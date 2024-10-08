import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*/*.mdx',
  contentType: 'mdx',
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
    lang: {
      type: 'string',
      resolve: (post) => {
        // ex. segments = [ 'posts', '1', 'en' ]
        const segments = post._raw.flattenedPath.split('/')
        return segments[2]
      },
    },
    slug: {
      type: 'string',
      resolve: (post) => {
        // ex. segments = [ 'posts', '1', 'en' ]
        const segments = post._raw.flattenedPath.split('/')
        return segments[1]
      },
    },
  },
}))

export default makeSource({ contentDirPath: 'contents', documentTypes: [Post] })
