import { cookies } from 'next/headers'
import { login } from './actions'

export default async function LoginPage() {
  // Get the returnTo value from the cookie
  let returnTo = '/app'

  const cookieStore = await cookies()
  const returnToCookie = cookieStore.get('returnTo')
  if (returnToCookie) {
    returnTo = returnToCookie.value
  }

  return (
    <form>
      <input type="hidden" name="returnTo" value={returnTo} />
      <button type="submit" formAction={login}>
        Log in with GitHub
      </button>
    </form>
  )
}
