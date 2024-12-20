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
    event: 'toolbarAction',
    element,
    zoomLevel,
    showMode,
  })
}
