import { redirect } from 'next/navigation'

export default function Page() {
  redirect(
    '/erd/p/github.com/mastodon/mastodon/blob/1bc28709ccde4106ab7d654ad5888a14c6bb1724/db/schema.rb',
  )
}
