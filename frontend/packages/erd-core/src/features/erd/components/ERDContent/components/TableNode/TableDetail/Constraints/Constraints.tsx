import type { Constraints as ConstraintsType } from '@liam-hq/db-structure/dist/schema'
import { Check, Fingerprint, KeyRound, Link, Lock } from '@liam-hq/ui'
import type React from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import { CheckConstraintsItem } from './CheckConstraintsItem'
import styles from './Constraints.module.css'
import { ForeignKeyConstraintsItem } from './ForeignKeyConstraintsItem'
import { PrimaryKeyConstraintsItem } from './PrimaryKeyConstraintsItem'
import { UniqueConstraintsItem } from './Unique'

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
  const uniqueConstraints = constraints.filter(
    (constraint) => constraint.type === 'UNIQUE',
  )
  const checkConstraints = constraints.filter(
    (constraint) => constraint.type === 'CHECK',
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
      {uniqueConstraints.length >= 1 ? (
        <div className={styles.itemWrapper}>
          <div className={styles.sectionTitle}>
            <Fingerprint className={styles.primaryKeyIcon} />
            Unique
          </div>
          {uniqueConstraints.map((constraint) => (
            <UniqueConstraintsItem
              key={constraint.name}
              uniqueConstraint={constraint}
            />
          ))}
        </div>
      ) : null}
      {checkConstraints.length >= 1 ? (
        <div className={styles.itemWrapper}>
          <div className={styles.sectionTitle}>
            <Check className={styles.primaryKeyIcon} />
            Check
          </div>
          {checkConstraints.map((constraint) => (
            <CheckConstraintsItem
              key={constraint.name}
              checkConstraint={constraint}
            />
          ))}
        </div>
      ) : null}
    </CollapsibleHeader>
  )
}
