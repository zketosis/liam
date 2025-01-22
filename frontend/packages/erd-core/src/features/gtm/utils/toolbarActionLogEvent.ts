import { pushToDataLayer } from './pushToDataLayer'

type ToolbarActionLogEvent = {
  element: string
  zoomLevel?: string
  showMode?: string
  platform: string
  ver: string
  appEnv: string
}

export const toolbarActionLogEvent = ({
  element,
  zoomLevel,
  showMode,
  platform,
  ver,
  appEnv,
}: ToolbarActionLogEvent) => {
  pushToDataLayer({
    event: 'toolbarAction',
    element,
    zoomLevel,
    showMode,
    platform,
    ver,
    appEnv,
  })
}
