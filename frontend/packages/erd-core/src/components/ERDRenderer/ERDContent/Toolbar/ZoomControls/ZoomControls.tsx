import { IconButton, Minus, Plus } from '@liam-hq/ui'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import { useReactFlow, useStore } from '@xyflow/react'
import { type FC, useCallback } from 'react'
import styles from './ZoomControls.module.css'

export const ZoomControls: FC = () => {
  const zoomLevel = useStore((store) => store.transform[2])
  const { zoomIn, zoomOut } = useReactFlow()

  const handleClickZoomOut = useCallback(() => {
    zoomOut()
  }, [zoomOut])

  const handleClickZoomIn = useCallback(() => {
    zoomIn()
  }, [zoomIn])

  return (
    <div className={styles.wrapper}>
      <ToolbarButton asChild onClick={handleClickZoomOut}>
        <IconButton icon={<Minus />} tooltipContent="Zoom Out" />
      </ToolbarButton>
      <span className={styles.zoomLevelText}>
        {Math.floor(zoomLevel * 100)}%
      </span>
      <ToolbarButton asChild onClick={handleClickZoomIn}>
        <IconButton icon={<Plus />} tooltipContent="Zoom In" />
      </ToolbarButton>
    </div>
  )
}
