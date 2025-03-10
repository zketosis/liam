import { notFound } from 'next/navigation'
import { migrationFlag } from '../../libs'

export default async function Page() {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  return (
    <main>
      <p>Migration feature enabled</p>
    </main>
  )
}
