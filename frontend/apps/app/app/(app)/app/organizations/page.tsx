import type { PageProps } from '@/app/types'
import { OrganizationsPage } from '@/features/organizations/pages/OrganizationsPage/OrganizationsPage'

export default function Page({ searchParams }: PageProps) {
  return <OrganizationsPage searchParams={searchParams} />
}
