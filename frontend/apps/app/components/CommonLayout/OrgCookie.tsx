'use client'

import { setOrganizationIdCookie } from '@/features/organizations/services/setOrganizationIdCookie'
import { type FC, useEffect } from 'react'

type Props = {
  orgId: string
}

export const OrgCookie: FC<Props> = ({ orgId }) => {
  useEffect(() => {
    setOrganizationIdCookie(orgId)
  }, [orgId])

  return null
}
