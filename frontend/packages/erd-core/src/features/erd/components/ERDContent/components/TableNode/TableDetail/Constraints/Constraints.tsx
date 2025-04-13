import type { Constraints as ConstraintsType } from '@liam-hq/db-structure/dist/schema'
import { KeyRound, Link, Lock } from '@liam-hq/ui'
import type React from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './Constraints.module.css'
import { ForeignKeyConstraintsItem } from './ForeignKeyConstraintsItem'
import { PrimaryKeyConstraintsItem } from './PrimaryKeyConstraintsItem'

type Props = {
  constraints: ConstraintsType
}

export const Constraints: React.FC<Props> = ({ constraints: _constraints }) => {
  const constraints = Object.values(_constraints)

  const primaryKeyConstraints = constraints.filter(
    (constraint) => constraint.type === 'PRIMARY KEY',
  )
  const foreignKeyConstraints = constraints.filter(
    (constraint) => constraint.type === 'FOREIGN KEY',
  )

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
      {primaryKeyConstraints.length >= 1 ? (
        <div className={styles.itemWrapper}>
          <div className={styles.sectionTitle}>
            <KeyRound className={styles.primaryKeyIcon} />
            Primary key
          </div>
          {primaryKeyConstraints.map((constraint) => (
            <PrimaryKeyConstraintsItem
              key={constraint.name}
              primaryKeyConstraint={constraint}
            />
          ))}
        </div>
      ) : null}
      {foreignKeyConstraints.length >= 1 ? (
        <div className={styles.itemWrapper}>
          <div className={styles.sectionTitle}>
            <Link className={styles.primaryKeyIcon} />
            Foreign key
          </div>
          {foreignKeyConstraints.map((constraint) => (
            <ForeignKeyConstraintsItem
              key={constraint.name}
              foreignKeyConstraint={constraint}
            />
          ))}
        </div>
      ) : null}
    </CollapsibleHeader>
  )
}
