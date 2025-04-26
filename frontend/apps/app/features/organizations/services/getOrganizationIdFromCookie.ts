import { cookies } from 'next/headers'
import { ORGANIZATION_ID_KEY } from '../constants'

export async function getOrganizationIdFromCookie(): Promise<string | null> {
  const cookirStore = await cookies()
  const cookie = cookirStore.get(ORGANIZATION_ID_KEY)

  return cookie?.value ?? null
}
