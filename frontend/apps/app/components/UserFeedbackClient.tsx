'use client'

import React from 'react'
import { UserFeedbackComponent } from './UserFeedbackComponent'

type UserFeedbackClientProps = {
  entityType: string
  entityId: string | number
}

export function UserFeedbackClient({ entityType, entityId }: UserFeedbackClientProps) {
  return <UserFeedbackComponent entityType={entityType} entityId={entityId} />
}
