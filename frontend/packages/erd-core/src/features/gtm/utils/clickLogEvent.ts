import { pushToDataLayer } from './pushToDataLayer'

type ClickLogEvent = {
  element: string
  platform: string
  ver: string
  appEnv: string
}

export const clickLogEvent = ({
  element,
  platform,
  ver,
  appEnv,
}: ClickLogEvent) => {
  pushToDataLayer({
    event: 'click',
    element,
    platform,
    ver,
    appEnv,
  })
}
