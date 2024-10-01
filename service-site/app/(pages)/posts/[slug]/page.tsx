import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'

export const getPost = (slug: string) => {
  return allPosts.find((post) => post.href === slug);
};

export const generateStaticParams = async () => allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = getPost(`/posts/${params.slug}`);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)
  return { title: post.title }
}

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = getPost(`/posts/${params.slug}`);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)
  return (
    <article>
      <div>
        <time dateTime={post.date}>
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post.title}</h1>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </article>
  )
}

export default PostLayout
