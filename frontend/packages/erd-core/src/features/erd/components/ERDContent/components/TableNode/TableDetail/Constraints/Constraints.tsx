import type { Constraints as ConstraintsType } from '@liam-hq/db-structure/dist/schema'
import { Lock } from '@liam-hq/ui'
import type React from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'

type Props = {
  constraints: ConstraintsType
}

export const Constraints: React.FC<Props> = ({}) => {
  return (
    <CollapsibleHeader
      title="Constraints #"
      icon={<Lock width={12} />}
      isContentVisible={true}
      // NOTE: Header height for Columns and Indexes section:
      // (40px (content) + 1px (border))) * 2 = 82px
      stickyTopHeight={82}
      contentMaxHeight={10000} // temporary value
    >
      {null}
    </CollapsibleHeader>
  )
}
