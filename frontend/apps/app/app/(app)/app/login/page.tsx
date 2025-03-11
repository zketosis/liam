import { login } from './actions'

export default function LoginPage() {
  return (
    <form>
      <button type="submit" formAction={login}>
        Log in with GitHub
      </button>
    </form>
  )
}
