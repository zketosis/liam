import { useDBStructureStore, useUserEditingStore } from '@/stores'
import { Table2 } from '@liam-hq/ui'
import { Handle, Position } from '@xyflow/react'
import type { FC } from 'react'
import styles from './TableHeader.module.css'

type Props = {
  name: string
}

export const TableHeader: FC<Props> = ({ name }) => {
  const { showMode } = useUserEditingStore()
  const { relationships } = useDBStructureStore()

  const isTarget = Object.values(relationships).some(
    (relationship) => relationship.foreignTableName === name,
  )
  const isSource = Object.values(relationships).some(
    (relationship) => relationship.primaryTableName === name,
  )

  return (
    <div className={styles.wrapper}>
      <Table2 width={16} />
      <span className={styles.name}>{name}</span>
      {showMode === 'TABLE_NAME' && (
        <>
          {isTarget && (
            <Handle id={name} type="target" position={Position.Left} />
          )}
          {isSource && (
            <Handle id={name} type="source" position={Position.Right} />
          )}
        </>
      )}
    </div>
  )
}
