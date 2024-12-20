import { pushToDataLayer } from './pushToDataLayer'

type ToolbarActionLogEvent = {
  element: string
  zoomLevel?: string
  showMode?: string
}

export const toolbarActionLogEvent = ({
  element,
  zoomLevel,
  showMode,
}: ToolbarActionLogEvent) => {
  pushToDataLayer({
    event: 'click',
    element,
    zoomLevel,
    showMode,
  })
}
