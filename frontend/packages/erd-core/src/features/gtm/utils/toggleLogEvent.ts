import { pushToDataLayer } from './pushToDataLayer'

type ToggleLogEvent = {
  element: string
  isShow: boolean
  tableId?: string
  platform: string
  ver: string
  appEnv: string
}

export const toggleLogEvent = (params: ToggleLogEvent) => {
  pushToDataLayer({
    event: 'toggle',
    ...params,
  })
}
